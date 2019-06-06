import { IncomingMessage, ServerResponse } from 'http'

export type Nullable<T> = T | null

export type FlatObject<T> = {
  [key: string]: T
}

export type Tags = FlatObject<Nullable<string>>
export type Headers = FlatObject<string>

export interface ITrace {
  id: string
  parentid: Nullable<string>
  rootid: string
  tags: Tags
  caller: {
    ip: Nullable<string>
    [key: string]: any
  }
  request: {
    method: string
    url: URL
    headers: Headers
    body: Nullable<string>
    timestamp: Date
  }
  response: {
    status: number
    headers: Headers
    body: Nullable<string>
    timestamp: Date
  }
}

export interface ITimestampedTrace extends ITrace {
  timestamp: Date
}

export interface IReporter {
  report(trace: ITimestampedTrace): Promise<void>
}

export interface IDeepTraceAgentConfigTags {
  app?: Nullable<string>
  environment?: Nullable<string>
  release?: Nullable<string>
  commit?: Nullable<string>
  [key: string]: Nullable<string> | undefined
}

export type IDeepTraceBeforeSendCallback = (
  trace: ITrace,
  req?: IncomingMessage,
  res?: ServerResponse
) => ITrace | null | undefined | false

export interface IDeepTraceAgentConfig {
  tags: IDeepTraceAgentConfigTags
  beforeSend: IDeepTraceBeforeSendCallback
  disableGlobalAutoContext: boolean
  requestBodySizeLimit: string
}

export interface IDeepTraceAgentConfigArg {
  tags?: IDeepTraceAgentConfigTags
  beforeSend?: IDeepTraceBeforeSendCallback
  disableGlobalAutoContext?: boolean
  requestBodySizeLimit?: string
}

export interface IDeepTraceContext {
  requestId: string
  parentRequestId: Nullable<string>
  rootRequestId: string
}

export interface IDeepTraceNativeHttpConfigArg {
  dsn: URL | string
  concurrency?: number
  headers?: Headers
  timeout?: number
}
