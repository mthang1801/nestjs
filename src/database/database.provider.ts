import { Pool, createPool } from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';
export const DatabasePoolFactory = async () => {
  return createPool({
    user: process.env.DATABASE_USERNAME,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: +process.env.DATABASE_PORT,
  });
};
