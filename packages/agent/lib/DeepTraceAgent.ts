import { debug, Debugger } from 'debug'
import { create as createDomain } from 'domain'
import defaultsdeep from 'lodash.defaultsdeep'
import { IncomingMessage, ServerResponse } from 'http'
import {
  extractContextFromRequest,
  extractRequestInfo,
  HEADERS,
  interceptResponseInfo,
  rethrow,
  extractCallerInfo
} from './utils'
import {
  Nullable,
  IReporter,
  ITrace,
  IDeepTraceAgentConfig,
  IDeepTraceAgentConfigArg,
  IDeepTraceContext
} from './types'
import enableGlobalAutoContext from './enableGlobalAutoContext'

const configFactory = (
  config: IDeepTraceAgentConfigArg
): IDeepTraceAgentConfig => {
  return defaultsdeep(config, {
    tags: {
      app: null,
      environment: process.env.NODE_ENV || 'development',
      commit: null,
      release: null,
      arch: process.arch,
      platform: process.platform as string,
      engine: `node/${process.version}`
    },
    disableGlobalAutoContext: false,
    beforeSend: (trace: ITrace) => trace,
    requestBodySizeLimit: '1mb'
  })
}

class DeepTraceAgent {
  protected reporter: Nullable<IReporter>
  protected debug: Debugger
  protected config: IDeepTraceAgentConfig

  constructor(
    reporter?: Nullable<IReporter>,
    config?: IDeepTraceAgentConfigArg
  ) {
    this.reporter = reporter || null
    this.debug = debug('deeptrace:agent')
    this.config = configFactory(config || {})

    if (this.config.disableGlobalAutoContext) return

    enableGlobalAutoContext()
  }

  public async report(trace: ITrace, req: IncomingMessage, res: ServerResponse) {
    if (!this.reporter) {
      this.debug(
        'skiping trace report "%s" because no reporter was set',
        trace.id
      )
      return
    }

    const traceToBeReported = this.config.beforeSend(trace, req, res)

    if (!traceToBeReported) {
      this.debug('skiping trace report "%s" because beforeSend returned empty')
      return
    }

    await this.reporter
      .report({
        ...traceToBeReported,
        timestamp: new Date()
      })
      .then(() => {
        this.debug('successfully reported trace "%s"', traceToBeReported.id)
      })
      .catch(err => {
        this.debug(
          'failed to report trace "%s": [%s] %s',
          traceToBeReported.id,
          err.name,
          err.message
        )
      })
  }

  public async bind(
    req: IncomingMessage,
    res: ServerResponse,
    fn: (context: IDeepTraceContext) => void
  ): Promise<void>
  public async bind<T>(
    req: IncomingMessage,
    res: ServerResponse,
    fn: (context: IDeepTraceContext) => T
  ): Promise<T> {
    const requestedAt = new Date()

    const trace = {
      ...extractContextFromRequest(req),
      tags: this.config.tags,
      caller: {},
      request: {},
      response: {}
    }

    const context = {
      requestId: trace.id,
      parentRequestId: trace.parentid,
      rootRequestId: trace.rootid
    }

    res.setHeader(HEADERS.requestId, context.requestId)
    this.debug('started inspecting request from trace "%s"', context.requestId)

    Promise
      .all([
        extractCallerInfo(req)
          .then((data) => {
            trace.caller = data
          }),
        interceptResponseInfo(res)
          .then(data => {
            this.debug('extracted response info for trace "%s"', trace.id)
            trace.response = data
          })
          .catch(
            rethrow(err => {
              this.debug(
                'failed to intercept response info for trace "%s": [%s] %s :: %s',
                trace.id,
                err.name,
                err.message,
                err.stack
              )
            })
          )
      ])
      .then(async () => {
        await extractRequestInfo(req, this.debug, context, this.config.requestBodySizeLimit)
          .then(data => {
            this.debug('extracted request info for trace "%s"', trace.id)
            trace.request = { ...data, timestamp: requestedAt }
          })
          .catch(
            rethrow(err => {
              this.debug(
                'failed to extract request info for trace "%s": [%s] %s :: %s',
                trace.id,
                err.name,
                err.message,
                err.stack
              )
            })
          )
      })
      .then(() => {
        const traceToBeReported = this.config.beforeSend(
          (trace as unknown) as ITrace
        )

        if (!traceToBeReported) {
          return
        }

        return this
        .report(traceToBeReported, req, res)
        .catch(
          rethrow(err => {
            this.debug(
              'failed to report trace "%s": [%s] %s :: %s',
              trace.id,
              err.name,
              err.message,
              err.stack
            )
          })
        )
      })
      .catch(() => {
        this.debug('aborted trace report "%s"', trace.id)
      })

    const domain = createDomain()

    Object.assign(domain, {
      deeptrace: {
        [HEADERS.parentRequestId]: context.requestId,
        [HEADERS.rootRequestId]: context.rootRequestId
      }
    })

    domain.add(req)
    domain.add(res)

    return new Promise((resolve, reject) => {
      domain.on('error', reject)

      domain.run(() => {
        resolve(fn(context))
      })
    })
  }
}

export default DeepTraceAgent
