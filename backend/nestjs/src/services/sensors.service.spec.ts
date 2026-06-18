import { Test, TestingModule } from '@nestjs/testing';
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from '../models/dto/create-sensor.dto';

describe('SensorsService', () => {
  let service: SensorsService;

  const mockSensorsRepository = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SensorsService,
        {
          // CAMBIO 1: Usamos el string exacto que pusiste en el @Inject()
          provide: 'ISensorRepository',
          useValue: mockSensorsRepository,
        },
      ],
    }).compile();

    service = module.get<SensorsService>(SensorsService);

    // CAMBIO 2: Para pedirle a NestJS el mock, también usamos el string
    repository = module.get<typeof mockSensorsRepository>('ISensorRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call repository.save with the correct data and return the result', async () => {
      const dto: CreateSensorDto = {
        name: 'Termómetro Alpha',
        type: 'TEMPERATURE',
      };
      const expectedSavedSensor = { id: 1, ...dto };

      mockSensorsRepository.save.mockResolvedValue(expectedSavedSensor);

      const result = await service.create(dto);

      expect(result).toEqual(expectedSavedSensor);
      expect(mockSensorsRepository.save).toHaveBeenCalledWith(dto);
      expect(mockSensorsRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});
