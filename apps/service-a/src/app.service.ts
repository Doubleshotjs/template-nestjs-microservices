import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() { }

  getHello() {
    return "Hello, I'm service A"
  }
}
