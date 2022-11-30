import { DynamicModule, Module } from '@nestjs/common'
import { LoggerService, LoggerServiceOptions } from './logger.service'

export interface LoggerModuleAsyncOptions {
  isGlobal?: boolean
  useFactory: (...args: any[]) => Promise<LoggerServiceOptions> | LoggerServiceOptions
  inject?: any[]
}

/**
 * Logger Module
 */
@Module({})
export class LoggerModule {
  static forRoot({ isGlobal = false, useFactory, inject }: LoggerModuleAsyncOptions): DynamicModule {
    return {
      global: isGlobal,
      module: LoggerModule,
      providers: [
        {
          provide: LoggerService,
          useFactory: async (...args: any[]) => {
            const options = await useFactory(...args)
            return new LoggerService(options)
          },
          inject,
        },
      ],
      exports: [LoggerService],
    }
  }
}
