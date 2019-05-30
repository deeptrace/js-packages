'use strict'

import debug from 'debug'
import env from 'sugar-env'
import path from 'path'
import yargs from 'yargs'
import relative from 'require-relative'
import { RequestListener } from 'http'

const requireRelative = (file: string) => {
  return relative(path.resolve(process.cwd(), file))
}

export default (
  serverName: string,
  extendYargsFn: (builder: yargs.Argv) => yargs.Argv
) => {
  const args = yargs
    .usage('Usage: $0 [app] [options]')
    .command(
      '$0 [app] [options]',
      `Serves the app with ${serverName}`,
      builder =>
        extendYargsFn(
          builder
            .positional('app', {
              describe: 'Relative path the your app file',
              default: 'app.js'
            })
            .alias('d', 'debug')
            .describe('d', 'Enables appify debug info')
            .boolean('d')
        )
    )
    .help('h')
    .alias('h', 'help').argv

  if (args.debug) {
    debug.enable('appify:*')
  }

  const appFactory: (arg: {
    environment: string
  }) => Promise<RequestListener> = requireRelative(args.app as string)

  return async (
    startServerFn: (props: {
      app: RequestListener
      args: { [key: string]: any }
      debug: debug.Debugger
      requireRelative: typeof requireRelative
      [key: string]: any
    }) => Promise<void>
  ): Promise<void> => {
    const environment = env.current
    const app = await appFactory({ environment })

    return startServerFn({
      app,
      args,
      debug: debug('appify:server'),
      requireRelative
    })
  }
}
