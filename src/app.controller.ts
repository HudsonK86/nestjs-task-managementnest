import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('info')
  getAppInfo() {
    return this.appService.getAppInfo();
  }

  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }
}

