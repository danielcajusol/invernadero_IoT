import { Injectable, Inject } from '@nestjs/common';
import type { ISensorRepository } from '../ports/out/ISensorRepository.interface';
import { CreateSensorDto } from '../models/dto/create-sensor.dto';

@Injectable()
export class SensorsService {
  constructor(
    @Inject('ISensorRepository')
    private readonly sensorsRepository: ISensorRepository,
  ) {}
  async create(dto: CreateSensorDto) {
    return this.sensorsRepository.save(dto);
  }
}
