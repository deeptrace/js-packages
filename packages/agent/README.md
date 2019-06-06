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

First thing you need to know is how to create an instance of DeepTrace's agent:

```js
const { DeepTraceAgent, NativeHttpReporter } = require('@deeptrace/agent')

const options = {
    tags: {
        app: 'my-custom-app'
    }
}

const agent = new DeepTraceAgent(
    new NativeHttpReporter({ dsn: new URL(process.env.DEEPTRACE_DSN) }),
    options
)
```

As you can see, the first argument for `DeepTraceAgent` is an instance of a `Reporter`.
This means that in the future we can ship DeepTrace with more reporters and you can create you own reporters as well.
Since DeepTrace does not ship with any security layer, creating or extending a reporter is the suggested way of handling any authentication mechanism you might have implemented.


### Using with express

```js
const agent = new DeepTraceAgent(/* see above how to instantiate an agent */)

app.use((req, res, next) => {
    agent.bind(req, res, (context) => {
        /**
         * You might want to store DeepTrace's context for some reason, like
         * propagating the context to Sentry or something like that.
         */
        Object.defineProperty(req, 'deeptrace', context)
        next()
    })
})
```


### Using with koa

```js
const agent = new DeepTraceAgent(/* see above how to instantiate an agent */)

app.use(async (ctx, next) => {
    await agent.bind(ctx.req, ctx.res, async (context) => {
        /**
         * You might want to store DeepTrace's context for some reason, like
         * propagating the context to Sentry or something like that.
         */
        Object.defineProperty(ctx, 'deeptrace', context)
        await next()
    })
})
```


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
