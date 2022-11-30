import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class AppService {
  constructor(
    @Inject('SERVICE_A') private readonly serviceAClient: ClientProxy,
    @Inject('SERVICE_B') private readonly serviceBClient: ClientProxy,
  ) { }

  getHelloFromServiceA() {
    return lastValueFrom(this.serviceAClient.send<string>(`hello`, {}))
  }

  getHelloFromServiceB() {
    return lastValueFrom(this.serviceBClient.send<string>(`hello`, {}))
  }
}
