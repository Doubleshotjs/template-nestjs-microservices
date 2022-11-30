import { Module } from '@nestjs/common'
import { GlobalModule } from '@app/modules'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    GlobalModule.forRoot({
      yamlFilePath: ['apps/service-a.yaml']
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
