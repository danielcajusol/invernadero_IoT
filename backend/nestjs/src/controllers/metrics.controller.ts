import {
  Controller,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import type { IMetricsService } from '../ports/in/IMetricsService.interface';
import { CreateMetricDto } from '../models/dto/create-metric.dto';

@Controller('metrics')
export class MetricsController {
  constructor(
    @Inject('IMetricsService')
    private readonly metricsService: IMetricsService,
  ) {}

  @Post(':idDevice')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('idDevice') idDevice: string,
    @Body() createMetricDto: CreateMetricDto,
  ) {
    return this.metricsService.registerMetrics(idDevice, createMetricDto);
  }

  /**
   * FETCH REAL-TIME READINGS (For Dashboard Widgets)
   * GET /metrics/:idDevice/latest?sensorType=temp,airHum
   */
  @Get(':idDevice/latest')
  @HttpCode(HttpStatus.OK)
  async getLatestReadings(
    @Param('idDevice') idDevice: string,
    @Query('sensorType') sensorType?: string,
  ) {
    if (!sensorType) {
      throw new BadRequestException(
        'The "sensorType" query parameter is required.',
      );
    }

    // Convert comma-separated string into a clean array
    const sensorTypes = sensorType.split(',').map((type) => type.trim());

    return this.metricsService.getLatestMetric(idDevice, sensorTypes);
  }

  /**
   * FETCH HISTORICAL DATASET (For Charts)
   * GET /metrics/:idDevice/history?sensorType=temp&rango=hoy
   */
  @Get(':idDevice/history')
  @HttpCode(HttpStatus.OK)
  async getHistoricalReadings(
    @Param('idDevice') idDevice: string,
    @Query('sensorType') sensorType?: string,
  ) {
    if (!sensorType) {
      throw new BadRequestException(
        'The "sensorType" query parameter is required.',
      );
    }

    return this.metricsService.getHistoryBySensorType(
      idDevice,
      sensorType.trim(),
    );
  }
}
