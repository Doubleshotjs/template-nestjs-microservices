import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('hello')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern('hello')
  @Get('hello')
  @ApiOperation({ summary: 'say hello' })
  @ApiResponse({ status: 200, type: String })
  getHello() {
    return this.appService.getHello()
  }
}
