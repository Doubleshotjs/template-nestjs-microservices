import { Module } from '@nestjs/common'
import { GlobalModule } from '@app/modules'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    GlobalModule.forRoot({
      yamlFilePath: ['apps/gateway.yaml'],
      // microservice name, see config/config.microservice.yaml
      microservice: ['SERVICE_A', 'SERVICE_B']
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
