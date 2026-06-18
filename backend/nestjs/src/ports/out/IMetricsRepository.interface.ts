export interface IMetricsRepository {
  saveMetric(value: number, date: Date, sensorId: string): Promise<any>;
  findLatestMetrics(idDevice: string, sensorTypes: string[]): Promise<any[]>;
  findHistoryMetrics(
    idDevice: string,
    sensorType: string,
    timeframe?: string,
  ): Promise<any[]>;
}
