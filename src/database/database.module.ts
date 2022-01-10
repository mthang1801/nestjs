import { Module, OnApplicationShutdown, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { DatabaseService } from './database.service';
import { DatabasePoolFactory } from './database.provider';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'mysql2/promise';
import { DatabaseCollection } from './database.collection';
import { DatabaseRepository } from './database.repository';
@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      useFactory: DatabasePoolFactory,
    },
    DatabaseService,
    DatabaseRepository,
  ],
  exports: [DatabaseService, DatabaseRepository],
})
export class DatabaseModule implements OnApplicationShutdown {
  private readonly logger = new Logger(DatabaseModule.name);
  constructor(private readonly moduleRef: ModuleRef) {}

  onApplicationShutdown(signal?: string): any {
    this.logger.log(`Shutting down on signal ${signal}`);
    const pool = this.moduleRef.get('DATABASE_POOL') as Pool;
    return pool.end();
  }
}
