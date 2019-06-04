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
  request: {
    method: string
    url: URL
    ip: string
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
  environment?: Nullable<string>
  service?: Nullable<string>
  release?: Nullable<string>
  commit?: Nullable<string>
  [key: string]: Nullable<string> | undefined
}

export interface IDeepTraceAgentConfig {
  tags: IDeepTraceAgentConfigTags
  beforeSend: (trace: ITrace) => ITrace | null | undefined
  disableGlobalAutoContext: boolean
}

export interface IDeepTraceAgentConfigArg {
  tags?: IDeepTraceAgentConfigTags
  beforeSend?: (trace: ITrace) => ITrace | null | undefined
  disableGlobalAutoContext?: boolean
}

export interface IDeepTraceContext {
  requestId: string
  parentRequestId: Nullable<string>
  rootRequestId: string
}

export interface IDeepTraceNativeHttpConfigArg {
  dsn: URL
  concurrency?: number
  headers?: Headers
  timeout?: number
}
