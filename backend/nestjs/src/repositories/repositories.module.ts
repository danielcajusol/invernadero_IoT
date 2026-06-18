import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Metric } from 'src/models/entities/metric.entity';
import { Sensor } from 'src/models/entities/sensor.entity';
import { SensorsRepository } from './sensors.repository';
import { MetricsRepository } from './metrics.repository';
import { DevicesRepository } from './device.repository';
import { Device } from 'src/models/entities/device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor, Metric, Device])],
  providers: [
    { provide: 'IMetricsRepository', useClass: MetricsRepository },
    { provide: 'ISensorRepository', useClass: SensorsRepository },
    DevicesRepository,
  ],
  exports: ['IMetricsRepository', 'ISensorRepository', DevicesRepository],
})
export class RepositoriesModule {}
