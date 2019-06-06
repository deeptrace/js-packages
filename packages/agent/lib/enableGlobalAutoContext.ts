import http, { OutgoingHttpHeaders } from 'http'
import https from 'https'
import {
  ClientHttp2Session,
  ClientSessionRequestOptions,
  ClientHttp2Stream
} from 'http2'

let __PATCHED__ = false

export default function enableGlobalAutoContext(): void {
  if (__PATCHED__) return

  const originalHttpRequest = http.request.bind(http)
  const originalHttpsRequest = https.request.bind(http)

  if (ClientHttp2Session) {
    const originalHttp2Request = ClientHttp2Session.prototype.request

    ClientHttp2Session.prototype.request = (
      headers?: OutgoingHttpHeaders | undefined,
      options?: ClientSessionRequestOptions | undefined
    ): ClientHttp2Stream => {
      const _headers = headers || {}

      if (process.domain) {
        const domain: NodeJS.Domain & {
          deeptrace?: { [key: string]: string }
        } = process.domain
        Object.assign(_headers, domain.deeptrace || {})
      }

      return originalHttp2Request(_headers, options)
    }
  }

  const factory = (originalFn: any) => {
    return (...args: any[]) => {
      const url =
        typeof args[0] === 'string' || args[0] instanceof URL
          ? args[0]
          : undefined

      const options = (url ? args[1] : args[0]) || {}

      const cb = url ? args[2] : args[1]

      if (process.domain) {
        const domain: NodeJS.Domain & {
          deeptrace?: { [key: string]: string }
        } = process.domain

        options.headers = {
          ...(options.headers || {}),
          ...(domain.deeptrace || {})
        }
      }

      return url ? originalFn(url, options, cb) : originalFn(options, cb)
    }
  }

  Object.assign(http, { request: factory(originalHttpRequest) })
  Object.assign(https, { request: factory(originalHttpsRequest) })

  __PATCHED__ = true
}
