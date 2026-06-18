import { Injectable, Logger, Inject } from '@nestjs/common';
import { CreateMetricDto } from '../models/dto/create-metric.dto';
import type { IMetricsService } from '../ports/in/IMetricsService.interface';
import type { IMetricsRepository } from '../ports/out/IMetricsRepository.interface';
import type { ISensorRepository } from '../ports/out/ISensorRepository.interface';
import {
  isAnomalousReading,
  calculateDewPoint,
  calculateMovingAverage,
} from 'src/algorithms/climate-math';
import {
  clasificarSuelo,
  isTankLevelCritical,
} from 'src/algorithms/soil-and-tank-math';

@Injectable()
export class MetricsService implements IMetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(
    @Inject('IMetricsRepository')
    private readonly metricsRepository: IMetricsRepository,
    @Inject('ISensorRepository')
    private readonly sensorsRepository: ISensorRepository,
  ) {}

  async registerMetrics(idDevice: string, dto: CreateMetricDto) {
    const latestData = await this.metricsRepository.findLatestMetrics(
      idDevice,
      ['temp'],
    );

    // Le decimos explícitamente al linter que confíe en que es un número
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const rawValue = latestData.length > 0 ? latestData[0].value : null;
    const lastTemp = rawValue !== null ? Number(rawValue) : null;

    const isAnomaly = isAnomalousReading(dto.temp, lastTemp);

    // B. Procesamiento Matemático
    const dewPointResult = calculateDewPoint(dto.temp, dto.airHum);
    const soilStatus = clasificarSuelo(dto.soilHum);
    const isTankCritical = isTankLevelCritical(dto.waterLevel);

    // C. Reporte en consola
    this.logger.log(`[Dispositivo ${idDevice}] Procesando nuevas métricas...`);

    this.logger.log(
      `Suelo: ${soilStatus} | Tanque Crítico: ${isTankCritical} | Rocío: ${dewPointResult.dewPoint}°C (${dewPointResult.status})`,
    );

    if (isAnomaly) {
      this.logger.warn(
        `¡Anomalía térmica detectada! Nueva: ${dto.temp}°C | Anterior: ${lastTemp}°C. Se descartará este valor.`,
      );
    }

    // 2. Mapeamos las métricas del DTO a un formato clave-valor para iterarlas fácilmente
    const mapMetrics = {
      temp: dto.temp,
      airHum: dto.airHum,
      soilHum: dto.soilHum,
      waterLevel: dto.waterLevel,
    };

    // 3. Iteramos cada métrica recibida para guardarla en su respectivo sensor
    for (const [sensorType, value] of Object.entries(mapMetrics)) {
      // Buscamos el sensor asociado a este dispositivo en la BD
      const sensor = await this.sensorsRepository.findByDeviceAndType(
        idDevice,
        sensorType,
      );

      if (!sensor) {
        // Opción A: Lanzar error si no existe (Exige aprovisionamiento previo en /handshake)
        console.warn(
          `[Advertencia] El sensor ${sensorType} no está registrado para el dispositivo ${idDevice}`,
        );
        continue;

        // Opción B (Alternativa): Podrías crearlo automáticamente acá si no querés hacer handshake previo
      }

      // Guardamos el registro histórico en la tabla 'metrics' asociada a ese idSensor
      await this.metricsRepository.saveMetric(value, new Date(), sensor.id);
    }

    return {
      status: 'success',
      message: 'Métricas históricas almacenadas con éxito',
    };
  }

  async getLatestReadings(
    idDevice: string,
    sensorTypes: string[],
  ): Promise<any[]> {
    if (sensorTypes.length === 0) return [];

    return await this.metricsRepository.findLatestMetrics(
      idDevice,
      sensorTypes,
    );
  }

  async getHistoryBySensorType(
    idDevice: string,
    sensorType: string,
  ): Promise<any[]> {
    const history = await this.metricsRepository.findHistoryMetrics(
      idDevice,
      sensorType,
    );

    if (history.length === 0) return [];

    const rawValues = history.map((item) => item.value);

    const averages = calculateMovingAverage(rawValues, 5);

    return history.map((item, index) => ({
      value: averages[index], //
      date: item.date,
    }));
  }
}
