import { Module } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { RepositoriesModule } from '../repositories/repositories.module';
import { MetricsService } from './metrics.service';
import { DevicesService } from './devices.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from 'src/models/entities/sensor.entity';
import { Metric } from 'src/models/entities/metric.entity';
import { Device } from 'src/models/entities/device.entity';

@Module({
  imports: [
    RepositoriesModule,
    TypeOrmModule.forFeature([Sensor, Metric, Device]),
  ],
  providers: [
    SensorsService,
    DevicesService,
    {
      provide: 'IMetricsService',
      useClass: MetricsService,
    },
  ],
  exports: [SensorsService, DevicesService, 'IMetricsService'],
})
export class ServicesModule {}
