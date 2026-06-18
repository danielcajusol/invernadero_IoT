import { Sensor } from '../../models/entities/sensor.entity';
import { CreateSensorDto } from '../../models/dto/create-sensor.dto';

export interface ISensorRepository {
  findByDeviceAndType(
    idDevice: string,
    sensorType: string,
  ): Promise<Sensor | null>;
  save(dto: CreateSensorDto): Promise<Sensor>;
}
