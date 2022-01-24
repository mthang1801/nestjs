import { createPool } from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';
export const DatabasePoolFactory = async (configService: ConfigService) => {
  const databaseName = configService.get<string>('databaseName');
  const databaseHost = configService.get<string>('databaseHost');
  const databasePort = configService.get<string>('databasePort');
  const databaseUsername = configService.get<string>('databaseUsername');
  const databasePassword = configService.get<string>('databasePassword');

  return createPool({
    user: databaseUsername,
    host: databaseHost,
    database: databaseName,
    password: databasePassword,
    port: +databasePort,
  });
};
