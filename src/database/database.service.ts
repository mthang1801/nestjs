import { Injectable, Inject, Logger } from '@nestjs/common';
import { Pool } from 'mysql2/promise';
@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async executeQuery(queryText: string, values: any[] = []): Promise<void> {
    this.logger.debug(`Executing query: ${queryText} (${values})`);
    this.pool
      .query(queryText, values)
      .then((result: any) => {
        this.logger.debug(
          `Executed query, result size ${result?.rows?.length}`,
        );
        console.log(result);
      })
      .catch((err) => console.log(err));
  }
}
