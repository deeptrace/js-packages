'use strict';

const { URL } = require('url');

module.exports = {
  id: '5500077a-1da3-4f73-9561-d5cbdf127728',
  parentid: null,
  rootid: '5500077a-1da3-4f73-9561-d5cbdf127728',
  tags: {
    service: 'sample-app-1',
    release: 'v1.3.0',
    commit: 'f3c835b06bc8fc58e414a3ac5730df05448bdf81'
  },
  request: {
    ip: '172.20.0.4',
    method: 'GET',
    uri: new URL('http://api-1.sample.127.0.0.1.nip.io/'),
    headers: {
      host: 'api-1.sample.127.0.0.1.nip.io',
      connection: 'close',
      'x-real-ip': '172.20.0.1',
      'x-forwarded-for': '172.20.0.1',
      'x-forwarded-proto': 'http',
      'x-forwarded-ssl': 'off',
      'x-forwarded-port': '80',
      'user-agent': 'curl/7.54.0',
      accept: '*/*'
    },
    body: null,
    timestamp: new Date('2019-01-02T21:25:34.847Z')
  },
  response: {
    status: 200,
    headers: {
      'x-dns-prefetch-control': 'off',
      'x-frame-options': 'SAMEORIGIN',
      'strict-transport-security': 'max-age=15552000; includeSubDomains',
      'x-download-options': 'noopen',
      'x-content-type-options': 'nosniff',
      'x-xss-protection': '1; mode=block',
      'deeptrace-id': '5500077a-1da3-4f73-9561-d5cbdf127728',
      'content-type': 'application/json; charset=utf-8',
      'content-length': '26',
      etag: 'W/"1a-30it95O9nVQ9C1pA+b1E6Ng9BKg"'
    },
    body: '{"message":"hello world!"}',
    timestamp: new Date('2019-01-02T21:25:34.982Z')
  },
  timestamp: new Date('2019-01-02T21:25:35.100Z')
};
