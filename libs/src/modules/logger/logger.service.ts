import { ConsoleLogger, Injectable } from '@nestjs/common'
import { Configuration, Logger, configure, getLogger } from 'log4js'

export type LoggerServiceOptions = Partial<Configuration> & {
  filename: string
}

@Injectable()
export class LoggerService extends ConsoleLogger {
  log4js: Logger
  filename: string

  constructor(options?: LoggerServiceOptions) {
    super()
    const { filename = 'logs/all.log', ..._options } = options || {}
    this.filename = filename

    configure({
      appenders: {
        all: {
          filename,
          type: 'dateFile',
          layout: { type: 'pattern', pattern: '%d [%p] %m' },
          pattern: 'yyyy-MM-dd',
          keepFileExt: true,
          alwaysIncludePattern: true,
          numBackups: 10,
        },
      },
      categories: { default: { appenders: ['all'], level: 'all' } },
      ..._options,
    })

    this.log4js = getLogger()
  }

  log(message: any, trace: string) {
    super.log.apply(this, arguments)
    this.log4js.info(trace, message)
  }

  error(message: any, trace: string) {
    super.error.apply(this, arguments)
    this.log4js.error(trace, message)
  }

  warn(message: any, trace: string) {
    super.warn.apply(this, arguments)
    this.log4js.warn(trace, message)
  }

  debug(message: any, trace: string) {
    super.debug.apply(this, arguments)
    this.log4js.debug(trace, message)
  }

  verbose(message: any, trace: string) {
    super.verbose.apply(this, arguments)
    this.log4js.info(trace, message)
  }
}
