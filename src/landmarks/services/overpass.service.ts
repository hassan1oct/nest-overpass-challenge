import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OverpassService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getNearbyLandmarks(lat: number, lng: number, radius: number = 500) {
    const query = `[out:json];
      (
        way["tourism"="attraction"](around:${radius},${lat},${lng});
        relation["tourism"="attraction"](around:${radius},${lat},${lng});
      );
      out body;
      >;
      out skel qt;`;

    const response = await this.httpService
      .post(this.configService.get<string>('OVERPASS_API_URL'), query, {
        headers: { 'Content-Type': 'text/plain' },
      })
      .toPromise();

    return response.data.elements;
  }
}