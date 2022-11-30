import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule } from '@nestjs/microservices'
import { rootPath } from '@app/tools'
import { load } from 'js-yaml'
import { cloneDeepWith, merge } from 'lodash'
import { LoggerModule } from '../logger'

export interface GlobalModuleOptions {
  yamlFilePath?: string[]
  microservice?: string[]
}

/**
 * Global Module
 */
@Module({})
export class GlobalModule {
  static forRoot(options: GlobalModuleOptions): DynamicModule {
    const { yamlFilePath = [], microservice } = options || {}

    const imports: DynamicModule['imports'] = [
      // config module
      ConfigModule.forRoot({
        isGlobal: true,
        cache: true,
        load: [
          () => {
            let configs: any = {}
            const configPath = [
              'config.yaml',
              'config.microservice.yaml',
              ...yamlFilePath,
            ]
            for (const path of configPath) {
              try {
                const filePath = join(rootPath, 'config', path)
                if (existsSync(filePath))
                  configs = merge(configs, load(readFileSync(filePath, 'utf8')))
              }
              catch { }
            }
            configs = cloneDeepWith(configs, (value) => {
              if (value === null)
                return ''
            })

            return configs
          },
        ],
      }),
      // logger module
      LoggerModule.forRoot({
        isGlobal: true,
        useFactory: (configService: ConfigService) => {
          const path = configService.get('logsPath')
          return { filename: join(rootPath, `logs/${path}/${path}.log`) }
        },
        inject: [ConfigService],
      }),
    ]

    // microservice module
    if (microservice) {
      imports.push({
        ...ClientsModule.registerAsync(
          microservice.map(name => ({
            name,
            useFactory: (configService: ConfigService) => {
              const microserviceClient = configService.get(`microserviceClients.${name}`)
              return microserviceClient
            },
            inject: [ConfigService],
          })),
        ),
        global: true,
      })
    }

    return {
      module: GlobalModule,
      imports
    }
  }
}
