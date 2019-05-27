import { Nullable, IReporter, ITrace } from './types'
import { debug, Debugger } from 'debug'
import { ReporterError } from './errors'

class DeepTraceAgent {
  protected reporter: Nullable<IReporter>
  protected debug: Debugger

  constructor(reporter?: IReporter) {
    this.reporter = reporter || null
    this.debug = debug('deeptrace:agent')
  }

  public async report(trace: ITrace) {
    if (!this.reporter) {
      return
    }

    try {
      await this.reporter.report({ ...trace, timestamp: new Date() })
      this.debug(`successfully reported trace "${trace.id}"`)
    } catch (err) {
      if (!(err instanceof ReporterError)) {
        throw err
      }

      this.debug(`failed to report trace "${trace.id}": ${err.message}`)
    }
  }
}

export default DeepTraceAgent
