import { v4 as uuid } from 'uuid';
import url, { UrlObject } from 'url';
import { IncomingMessage, ServerResponse, IncomingHttpHeaders } from 'http';
import { Nullable, IDeepTraceContext } from './types';
import forwareded from 'forwarded';
import raw from 'raw-body';
import inflate from 'inflation';

const iWantABuffer = (
  chunk: Buffer | string | null,
  encoding?: string | undefined
): Buffer => {
  if (chunk === null) {
    return Buffer.from('');
  }

  if (Buffer.isBuffer(chunk)) {
    return chunk;
  }

  if (encoding === undefined) {
    return Buffer.from(chunk);
  }

  if (encoding === 'buffer') {
    return Buffer.from(chunk);
  }

  return Buffer.from(chunk, encoding as BufferEncoding);
};

const stringify = (
  body: Object | Array<any> | string | String | null | undefined
): Nullable<string> => {
  if (!body) {
    return null;
  }

  if (typeof body === 'object' && Object.keys(body).length === 0) {
    return null;
  }

  if (typeof body === 'string' || body instanceof String) {
    return body as string;
  }

  return JSON.stringify(body);
};

export const HEADERS = {
  requestId: 'DeepTrace-Request-Id',
  parentRequestId: 'DeepTrace-Parent-Request-Id',
  rootRequestId: 'DeepTrace-Root-Request-Id'
};

const getHeaderCaseInsesitive = (
  headers: IncomingHttpHeaders,
  header: string
): Nullable<string> => {
  const key = Object.keys(headers)
    .map(key => key.toLowerCase())
    .filter(key => key.length === header.length)
    .find(key => key === header.toLowerCase());

  if (!key) {
    return null;
  }

  return headers[key] as string;
};

export function extractContextFromRequest(req: IncomingMessage) {
  const id = uuid();
  const parentid = getHeaderCaseInsesitive(
    req.headers,
    HEADERS.parentRequestId
  );
  const rootid =
    getHeaderCaseInsesitive(req.headers, HEADERS.rootRequestId) || id;

  return { id, parentid, rootid };
}

type CustomRequest = IncomingMessage & { connection: { encrypted?: boolean } };

const getProtocol = async (req: CustomRequest) => {
  const proto = req.connection.encrypted ? 'https' : 'http';

  const header =
    getHeaderCaseInsesitive(req.headers, 'X-Forwarded-Proto') || proto;
  const index = header.indexOf(',');

  return index !== -1 ? header.substring(0, index).trim() : header.trim();
};

const getHostnameAndPort = async (
  req: CustomRequest
): Promise<{ hostname?: string; port?: string }> => {
  let hostname = getHeaderCaseInsesitive(req.headers, 'X-Forwarded-Host');

  if (!hostname) {
    hostname = getHeaderCaseInsesitive(req.headers, 'Host');
  } else if (hostname.indexOf(',') !== -1) {
    hostname = hostname.substring(0, hostname.indexOf(',')).trimRight();
  }

  if (!hostname) return {};

  // IPv6 literal support
  const offset = hostname[0] === '[' ? hostname.indexOf(']') + 1 : 0;
  const index = hostname.indexOf(':', offset);

  return index !== -1
    ? {
        hostname: hostname.substring(0, index),
        port: hostname.substring(index + 1)
      }
    : { hostname };
};

const getClientIP = async (req: CustomRequest) => {
  return forwareded(req)[0] || null;
};

export async function extractCallerInfo(
  req: IncomingMessage & { body?: any; ip?: string }
) {
  return {
    ip: await getClientIP(req as CustomRequest)
  };
}

export async function extractRequestInfo(
  req: IncomingMessage & { body?: any; ip?: string },
  debug: debug.Debugger,
  context: IDeepTraceContext,
  requestBodySizeLimit: string
) {
  const [protocol, hostnameAndPort, body] = await Promise.all([
    getProtocol(req as CustomRequest),
    getHostnameAndPort(req as CustomRequest),
    (async () => {
      if (req.hasOwnProperty('body')) {
        return stringify(req.body);
      }

      const len = req.headers['content-length'];
      const encoding = req.headers['content-encoding'] || 'identity' || 'utf8';

      return raw(inflate(req), {
        encoding,
        length: len && encoding === 'identity' ? ~~len : len,
        limit: requestBodySizeLimit
      }).catch(err => {
        debug(
          'unable to capture body for trace "%s": [%s] %s',
          context.requestId,
          err.type,
          err.message
        );

        return null;
      });
    })()
  ]);

  const requestUrl = url.parse(req.url || '');

  return {
    method: req.method,
    url: {
      ...hostnameAndPort,
      protocol,
      pathname: requestUrl.pathname
    } as UrlObject,
    query: requestUrl.search || null,
    headers: req.headers,
    body: body || null
  };
}

export function rethrow(fn: (err: Error) => void) {
  return (err: Error): void => {
    fn(err);
    throw err;
  };
}

export async function interceptResponseInfo(
  res: ServerResponse
): Promise<{ [key: string]: any }> {
  return new Promise(resolve => {
    const originalWrite = res.write.bind(res);
    const originalEnd = res.end.bind(res);
    const chunks: Buffer[] = [];

    type WriteCb = (error: Error | undefined) => void;
    function write(chunk: any, cb?: WriteCb): boolean;
    function write(chunk: any, encoding: string, cb?: WriteCb): boolean;
    function write(chunk: any, ...args: any[]): boolean {
      const encoding = typeof args[0] === 'string' ? args[0] : undefined;
      chunks.push(iWantABuffer(chunk, encoding));

      return originalWrite(chunk, ...args);
    }

    type EndCb = () => void;
    function end(cb?: EndCb): void;
    function end(chunk: any, cb?: EndCb): void;
    function end(chunk: any, encoding: string, cb?: EndCb): void;
    function end(...args: any[]): void {
      const chunk =
        typeof args[0] !== 'function'
          ? (args[0] as Buffer | string)
          : undefined;

      const encoding = typeof args[1] === 'string' ? args[1] : undefined;

      if (chunk) {
        chunks.push(iWantABuffer(chunk, encoding));
      }

      resolve({
        status: res.statusCode,
        headers: { ...res.getHeaders() },
        body: Buffer.concat(chunks).toString('utf-8') || null,
        timestamp: new Date()
      });

      originalEnd(...args);
    }

    Object.assign(res, { end, write });
  });
}
