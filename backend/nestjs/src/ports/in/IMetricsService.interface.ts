import { CreateMetricDto } from 'src/models/dto/create-metric.dto';

export interface IMetricsService {
  registerMetrics(idDevice: string, dto: CreateMetricDto): Promise<any>;
  getLatestReadings(idDevice: string, sensorTypes: string[]): Promise<any[]>;
  getHistoryBySensorType(
    idDevice: string,
    sensorType: string,
    timeframe?: string,
  ): Promise<any[]>;
}
