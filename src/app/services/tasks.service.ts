import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private scheduleRegistry: SchedulerRegistry) {}
  @Cron('10 * * * * *', {
    name: 'notifications',
    timeZone: 'Europe/Paris',
  })
  handleCron() {
    this.logger.debug('There are notifications');
  }

  @Interval(10000)
  handleInterval() {
    this.logger.debug('Call every 10s');
  }

  addCronJob(name: string, seconds: string) {
    const job = new CronJob(`${seconds} * * * * *`, () => {
      this.logger.warn(`time (${seconds}) for job ${name} to run!`);
    });
    this.scheduleRegistry.addCronJob(name, job);
    job.start();
    this.logger.warn(
      `job ${name} added for each minute at ${seconds} seconds!`,
    );
  }

  deleteCron(name: string) {
    this.scheduleRegistry.deleteCronJob(name);
    this.logger.warn(`job ${name} deleted`);
  }
}
