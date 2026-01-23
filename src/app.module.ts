import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [HealthModule, TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
