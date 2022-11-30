import { NestFactory } from '@nestjs/core'
import { INestApplication, NestApplicationOptions } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { MicroserviceOptions } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
import { LoggerService } from '@app/modules'

type BootstrapOptions = NestApplicationOptions & {
  before?: (app: INestApplication) => void
  microservice?: boolean
}

export async function bootstrap(module: any, bootstrapOptions?: BootstrapOptions) {
  const { before, microservice, ...options } = bootstrapOptions || {}
  const app = await NestFactory.create(module, options)

  // before hook
  before?.(app)

  // logger service
  const loggerService = app.get(LoggerService)
  app.useLogger(loggerService)

  // config service
  const configService: ConfigService = app.get(ConfigService)
  const server = configService.get('server')
  app.setGlobalPrefix(server.prefix)

  // swagger
  const swagger = configService.get('swagger')
  const documentBuilder = new DocumentBuilder()
    .setTitle(swagger.title)
    .setDescription(swagger.description)
    .addBearerAuth()
    .addServer(server.prefix)
    .build()
  const document = SwaggerModule.createDocument(app, documentBuilder, { ignoreGlobalPrefix: true })
  SwaggerModule.setup(swagger.path, app, document)

  // microservice
  const microserviceService = configService.get('microserviceService')
  if (microservice && microserviceService) {
    app.connectMicroservice<MicroserviceOptions>(microserviceService, { inheritAppConfig: true })
    await app.startAllMicroservices()
  }

  // http
  await app.listen(server.port)

  // catch process error
  process.on('uncaughtException', (err) => {
    loggerService.error(err, 'Process Error')
  })

  loggerService.log(`http://localhost:${server.port}/${swagger.path}`, swagger.title)
}
