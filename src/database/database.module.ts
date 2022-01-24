import { Module, OnApplicationShutdown, Logger, Global } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { DatabaseService } from './database.service';
import { DatabasePoolFactory } from './database.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pool } from 'mysql2/promise';
import { UserRepository } from '../app/repositories/user.repository';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      useFactory: async (configService: ConfigService) =>
        DatabasePoolFactory(configService),
      inject: [ConfigService],
    },
    DatabaseService,
  ],
  exports: [DatabaseService],
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
