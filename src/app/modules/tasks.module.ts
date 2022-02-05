import { Module, Global } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';

@Global()
@Module({
  providers: [TasksService],
  exports: [TasksService],
})
export class TaskModule {}
