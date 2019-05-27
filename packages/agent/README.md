[![Prettier code style](https://img.shields.io/badge/code_style-prettier+custom-brightgreen.svg)](https://standardjs.com)
![Package latest version](https://img.shields.io/npm/v/@deeptrace/agent/latest.svg?label=%40deeptrace%2Fagent)
![Required node version](https://img.shields.io/node/v/@deeptrace/agent.svg?style=flat)
![Supported types](https://img.shields.io/npm/types/@deeptrace/agent.svg)

# @deeptrace/agent

Agnostic traces reporter agent for Node.js.

You can learn more about the "why"s behind this package and DeepTrace's ecosystem [here](https://app.gitbook.com/@deeptrace/s/docs/js-packages/deeptrace-agent).


## How to install

This is a [Node.js](https://nodejs.org/en/) module available through the [npm registry](https://www.npmjs.com).

Installation is done using the npm install command:

```sh
npm install @deeptrace/agent
```

## How to use

Comming soon...


## Exported objects

- DeepTraceAgent
- ITrace
- IReporter
- NativeHttpReporter
- ReporterError
- NativeHttpReporterError
- FailedRequestError
- InvalidPayloadError
- RequestTimeoutError


## Errors inheritance tree

- ReporterError
    - NativeHttpReporterError
        - FailedRequestError
        - InvalidPayloadError
        - RequestTimeoutError
