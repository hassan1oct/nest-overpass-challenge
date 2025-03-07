import {
  Body,
  Controller,
  Post,
  Headers,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { LandmarksService } from '../services/landmarks.service';
import { WebhookDto } from '../dto/webhook.dto';

@Controller()
export class LandmarksController {
  constructor(private readonly landmarksService: LandmarksService) {}

  @Post('webhook')
  @HttpCode(HttpStatus.ACCEPTED)
  async handleWebhook(
    @Body() webhookDto: WebhookDto,
    @Headers('Authorization') authHeader: string,
  ) {
    if (authHeader !== `Bearer ${process.env.SECRET_KEY}`) {
      throw new UnauthorizedException('Invalid authorization token');
    }
    return this.landmarksService.processCoordinates(webhookDto);
  }

  @Get('landmarks')
  async getLandmarks(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
  ) {
    return this.landmarksService.getLandmarks(lat, lng);
  }
}