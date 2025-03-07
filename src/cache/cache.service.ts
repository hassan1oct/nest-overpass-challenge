import { Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectCache } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  constructor(@InjectCache() private readonly cacheManager: Cache) {}

  async getCachedLandmarks(key: string) {
    return this.cacheManager.get(key);
  }

  async setCachedLandmarks(key: string, value: any) {
    await this.cacheManager.set(key, value, { ttl: 3600 }); // 1 hour TTL
  }
}