import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}
  async get(key): Promise<any> {
    return this.cache.get(key);
  }
  async set(key, value): Promise<void> {
    this.cache.set(key, value);
  }
}
