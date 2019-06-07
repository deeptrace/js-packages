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
    new NativeHttpReporter({ dsn: process.env.DEEPTRACE_DSN }),
    options
)
```

You can provide a `null`, which will prevent any trace to be reported.
This is useful when DeepTrace's DSN wasn't provided.

```js
const reporter = process.env.DEEPTRACE_DSN
    ? new NativeHttpReporter({ dsn: process.env.DEEPTRACE_DSN })
    : null
const agent = new DeepTraceAgent(reporter, options)
```

As you can see, the first argument for `DeepTraceAgent` is an instance of a `Reporter`.
This means that in the future we can ship DeepTrace with more reporters and you can create you own reporters as well.
Since DeepTrace does not ship with any security layer, creating or extending a reporter is the suggested way of handling any authentication mechanism you might have implemented.

Now that you have an agent's instance, you can bind it to the current request and response:

```js
agent.bind(req, res, (context) => {
    /**
     * You might want to store DeepTrace's context for some reason, like
     * propagating the context to Sentry or something like that.
     */
    Object.defineProperty(req, 'deeptrace', context)
    next()
})
```

Anything called directly or indirectly from within `bind`'s callback is now wrapped on a **DeepTrace's Domain**. Any HTTP request done from within **DeepTrace's Domain** will have **DeepTrace's Context Headers** propagated automagically. This funtionality relies on node's native [Domain](https://nodejs.org/docs/latest-v12.x/api/domain.html) module and some monkey patching (`http.request` and `https.request` reads context headers from active domain). You might notice that `Domain` module is deprecated for a few years but hasn't been removed yet because there's no alternative API to do what it does. There're major projects such as SentryJS relying on this module so I trust that it won't be removed so soon - and if it gets removed, we'll be updating this package to use the new alternative API.

DeeTrace's agent relies only on native functionality from [http.IncomingMessage](https://nodejs.org/docs/latest-v12.x/api/http.html#http_class_http_incomingmessage) and [http.ServerResponse](https://nodejs.org/docs/latest-v12.x/api/http.html#http_class_http_serverresponse), therefore it can work with virtually any server (like [spdy](https://www.npmjs.com/package/spdy)) and web (micro)framework so you don't need to be constrained by [express](https://www.npmjs.com/package/express) and [koa](https://www.npmjs.com/package/koa).

### Using with express

```js
const agent = new DeepTraceAgent(/* see above how to instantiate an agent */)

app.use((req, res, next) => {
    agent.bind(req, res, (context) => {
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
