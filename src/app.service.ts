import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getAppInfo(): { name: string; version: string; status: string } {
    return {
      name: 'Task Management API',
      version: '1.0.0',
      status: 'running',
    };
  }

  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }
}

