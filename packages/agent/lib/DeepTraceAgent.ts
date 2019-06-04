import { debug, Debugger } from 'debug'
import { ReporterError } from './errors'
import { create as createDomain } from 'domain'
import defaultsdeep from 'lodash.defaultsdeep'
import { IncomingMessage, ServerResponse } from 'http'
import {
  extractContextFromRequest,
  extractRequestInfo,
  HEADERS,
  interceptResponseInfo,
  rethrow
} from './utils'
import {
  Nullable,
  IReporter,
  ITrace,
  IDeepTraceAgentConfig,
  IDeepTraceAgentConfigArg,
  IDeepTraceContext
} from './types'

const configFactory = (
  config: IDeepTraceAgentConfigArg
): IDeepTraceAgentConfig => {
  return defaultsdeep(config, {
    tags: {},
    beforeSend: (trace: ITrace) => trace
  })
}

class DeepTraceAgent {
  protected reporter: Nullable<IReporter>
  protected debug: Debugger
  protected config: IDeepTraceAgentConfig

  constructor(reporter?: Nullable<IReporter>, config?: IDeepTraceAgentConfigArg) {
    this.reporter = reporter || null
    this.debug = debug('deeptrace:agent')
    this.config = configFactory(config || { })
  }

  public async report(trace: ITrace) {
    if (!this.reporter) {
      this.debug(
        'skiping trace report "%s" because reporter was not properly configured',
        trace.id
      )
      return
    }

    try {
      await this.reporter.report({ ...trace, timestamp: new Date() })
      this.debug('successfully reported trace "%s"', trace.id)
    } catch (err) {
      if (!(err instanceof ReporterError)) {
        throw err
      }

      this.debug(
        'failed to report trace "%s": [%s] %s',
        trace.id,
        err.name,
        err.message
      )
    }
  }

  public bind(
    req: IncomingMessage,
    res: ServerResponse,
    fn: (context: IDeepTraceContext) => void
  ): void {
    const requestedAt = new Date()
    const context = extractContextFromRequest(req)

    res.setHeader(HEADERS.requestId, context.id)
    this.debug('started inspecting request from trace "%s"', context.id)

    const trace = {
      ...context,
      tags: this.config.tags,
      request: {},
      response: {}
    }

    Promise.resolve()
      .then(async () => {
        await interceptResponseInfo(res)
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

        await extractRequestInfo(req, this.debug)
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
        const traceToBeReported = this.config.beforeSend(trace as ITrace)

        if (!traceToBeReported) {
          return
        }

        return this.report(traceToBeReported).catch(
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
        [HEADERS.parentRequestId]: context.id,
        [HEADERS.rootRequestId]: context.rootid
      }
    })

    domain.add(req)
    domain.add(res)
    domain.on('error', err => {
      throw err
    })

    domain.run(() => {
      fn({
        requestId: context.id,
        parentRequestId: context.parentid,
        rootRequestId: context.rootid
      })
    })
  }
}

export default DeepTraceAgent
