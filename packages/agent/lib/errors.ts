import { CommonError } from '@deeptrace/commons';

export abstract class DeepTraceAgentError extends CommonError {
  //
}

export abstract class ReporterError extends DeepTraceAgentError {
  //
}

export abstract class NativeHttpReporterError extends ReporterError {
  //
}

export class FailedRequestError extends NativeHttpReporterError {
  //
}

export class InvalidPayloadError extends FailedRequestError {
  //
}

export class RequestTimeoutError extends FailedRequestError {
  //
}
