import { Module, OnApplicationShutdown, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { DatabaseService } from './database.service';
import { DatabasePoolFactory } from './database.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pool } from 'mysql2/promise';
import { UserRepository } from '../users/user.repository';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      useFactory: async (configService: ConfigService) =>
        DatabasePoolFactory(configService),
      inject: [ConfigService],
    },
    DatabaseService,
    UserRepository,
  ],
  exports: [DatabaseService, UserRepository],
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
