import {
  Headers,
  IReporter,
  ITimestampedTrace,
  IDeepTraceNativeHttpConfigArg
} from '../types'
import { Agent as HttpAgent, request as httprequest } from 'http'
import { Agent as HttpsAgent, request as httpsrequest } from 'https'

import {
  RequestTimeoutError,
  InvalidPayloadError,
  FailedRequestError
} from '../errors'

class NativeHttpReporter implements IReporter {
  protected agent: HttpAgent | HttpsAgent
  protected dsn: URL
  protected headers: Headers
  protected timeout: number
  protected path: string = '/traces'

  constructor({
    dsn,
    concurrency = 10,
    headers = {},
    timeout = 3000
  }: IDeepTraceNativeHttpConfigArg) {
    this.headers = headers
    this.timeout = timeout
    this.dsn = dsn instanceof URL
      ? dsn
      : new URL(dsn)

    this.agent = this.createAgent(this.dsn.protocol, concurrency)
  }

  public async report(trace: ITimestampedTrace) {
    await this.send(trace)
  }

  protected createAgent(protocol: string, concurrency: number) {
    const options = {
      keepAlive: true,
      maxSockets: concurrency
    }

    return protocol === 'https:'
      ? new HttpsAgent(options)
      : new HttpAgent(options)
  }

  protected getJsonBody(trace: ITimestampedTrace): string {
    return JSON.stringify(trace)
  }

  protected async getAuthorizationHeader(): Promise<Headers> {
    if (!this.dsn.username && !this.dsn.password) {
      return {}
    }

    const encoded = Buffer.from(
      `${this.dsn.username}:${this.dsn.password}`
    ).toString('base64')

    return {
      authorization: `Basic ${encoded}`
    }
  }

  protected getHeaders(body: string): Headers {
    return {
      ...this.headers,
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(body).toString()
    }
  }

  protected async getRequestOptions(body: string): Promise<Object> {
    return {
      agent: this.agent,
      method: 'POST',
      protocol: this.dsn.protocol,
      hostname: this.dsn.hostname,
      port: this.dsn.port,
      path: this.path,
      headers: {
        ...this.getHeaders(body),
        ...(await this.getAuthorizationHeader())
      }
    }
  }

  protected async send(trace: ITimestampedTrace) {
    const body = this.getJsonBody(trace)
    const options = await this.getRequestOptions(body)
    const request = this.dsn.protocol === 'https:' ? httpsrequest : httprequest

    await new Promise((resolve, reject) => {
      const req = request(options, res => {
        if (res.statusCode === 422) {
          return reject(
            new InvalidPayloadError('request failed due to invalid payload')
          )
        }

        if (res.statusCode !== 204) {
          return reject(
            new FailedRequestError(
              `request failed with response status code "${res.statusCode}"`
            )
          )
        }

        resolve()
      })

      req.setTimeout(this.timeout, () => {
        req.abort()
        reject(new RequestTimeoutError('request timed out'))
      })

      req.on('error', err => {
        reject(new FailedRequestError(err.message, err.stack))
      })

      req.end(body)
    })
  }
}

export default NativeHttpReporter
