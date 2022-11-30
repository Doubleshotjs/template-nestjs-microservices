import { Module } from '@nestjs/common'
import { GlobalModule } from '@app/modules'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    GlobalModule.forRoot({
      yamlFilePath: ['apps/service-b.yaml']
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
