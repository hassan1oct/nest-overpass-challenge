import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Landmark } from 'src/database/entities/landmark.entity';
import { OverpassService } from './overpass.service';
import { WebhookDto } from '../dto/webhook.dto';
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class LandmarksService {
  constructor(
    @InjectRepository(Landmark)
    private readonly landmarkRepository: Repository<Landmark>,
    private readonly overpassService: OverpassService,
    private readonly cacheService: CacheService,
  ) {}

  async processCoordinates(webhookDto: WebhookDto) {
    const { lat, lng } = webhookDto;
    const landmarks = await this.overpassService.getNearbyLandmarks(lat, lng);

    if (landmarks.length === 0) {
      await this.landmarkRepository.save({ lat, lng });
      return { message: 'No landmarks found, coordinates saved.' };
    }

    const transformedLandmarks = landmarks.map((landmark) => ({
      lat,
      lng,
      name: landmark.tags?.name || 'Unknown',
      type: landmark.tags?.tourism || 'Unknown',
    }));

    await this.landmarkRepository.save(transformedLandmarks);
    return { message: 'Landmarks saved successfully.' };
  }

  async getLandmarks(lat: number, lng: number) {
    const cacheKey = `landmarks_${lat}_${lng}`;
    const cachedLandmarks = await this.cacheService.getCachedLandmarks(cacheKey);

    if (cachedLandmarks) {
      return cachedLandmarks;
    }

    const landmarks = await this.landmarkRepository.find({ where: { lat, lng } });
    await this.cacheService.setCachedLandmarks(cacheKey, landmarks);
    return landmarks;
  }
}