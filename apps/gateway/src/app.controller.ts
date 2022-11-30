import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('hello')
@Controller('hello')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('service_a')
  @ApiOperation({ summary: 'say hello from service_a' })
  @ApiResponse({ status: 200, type: String })
  getHelloFromServiceA() {
    return this.appService.getHelloFromServiceA()
  }

  @Get('service_b')
  @ApiOperation({ summary: 'say hello from service_b' })
  @ApiResponse({ status: 200, type: String })
  getHelloFromServiceB() {
    return this.appService.getHelloFromServiceB();
  }
}
