import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';

jest.mock('src/algorithms/climate-math', () => ({
  isAnomalousReading: jest.fn().mockReturnValue(false),
  calculateDewPoint: jest
    .fn()
    .mockReturnValue({ dewPoint: 14.2, status: 'NORMAL' }),
  calculateMovingAverage: jest.fn(),
}));

jest.mock('src/algorithms/soil-and-tank-math', () => ({
  clasificarSuelo: jest.fn().mockReturnValue('HÚMEDO'),
  isTankLevelCritical: jest.fn().mockReturnValue(false),
}));

describe('MetricsService', () => {
  let service: MetricsService;

  // Creamos los mocks de los repositorios
  const mockMetricsRepository = {
    findLatestMetrics: jest.fn(),
    findHistoryMetrics: jest.fn(),
    saveMetric: jest.fn(),
  };

  const mockSensorsRepository = {
    findByDeviceAndType: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        // Inyectamos los mocks usando los TOKENS de las interfaces
        { provide: 'IMetricsRepository', useValue: mockMetricsRepository },
        { provide: 'ISensorRepository', useValue: mockSensorsRepository },
      ],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Actualizamos el nombre del método a getLatestReadings
  describe('getLatestReadings', () => {
    it('should return an empty array instantly if no sensor types are requested', async () => {
      const result = await service.getLatestReadings('device-123', []);

      expect(result).toEqual([]);
      expect(mockMetricsRepository.findLatestMetrics).not.toHaveBeenCalled();
    });

    it('should query the repository when sensor types are provided', async () => {
      const mockDbResult = [{ type: 'temp', value: 25 }];
      mockMetricsRepository.findLatestMetrics.mockResolvedValue(mockDbResult);

      const result = await service.getLatestReadings('device-123', ['temp']);

      expect(result).toEqual(mockDbResult);
      expect(mockMetricsRepository.findLatestMetrics).toHaveBeenCalledWith(
        'device-123',
        ['temp'],
      );
    });
  });

  describe('getHistoryBySensorType', () => {
    it('should return an empty array if no historical database metrics exist', async () => {
      mockMetricsRepository.findHistoryMetrics.mockResolvedValue([]);

      const result = await service.getHistoryBySensorType('device-123', 'temp');

      expect(result).toEqual([]);
      expect(mockMetricsRepository.findHistoryMetrics).toHaveBeenCalledWith(
        'device-123',
        'temp',
      );
    });

    it('should return the untouched history array when data exists', async () => {
      const mockHistory = [
        { value: 20, date: new Date() },
        { value: 22, date: new Date() },
      ];
      mockMetricsRepository.findHistoryMetrics.mockResolvedValue(mockHistory);

      const result = await service.getHistoryBySensorType('device-123', 'temp');

      expect(result).toEqual(mockHistory);
    });
  });

  describe('registerMetrics', () => {
    it('should successfully filter, process, and map telemetry metrics down to verified sensor targets', async () => {
      const mockDto = {
        temp: 24.5,
        airHum: 60,
        soilHum: 45,
        waterLevel: 80,
      };

      mockMetricsRepository.findLatestMetrics.mockResolvedValue([
        { value: '23.0' },
      ]);

      mockSensorsRepository.findByDeviceAndType.mockResolvedValue({
        id: 'sensor-uuid-999',
      });

      const result = await service.registerMetrics('device-123', mockDto);

      expect(result).toEqual({
        status: 'success',
        message: 'Métricas históricas almacenadas con éxito',
      });

      expect(mockSensorsRepository.findByDeviceAndType).toHaveBeenCalledTimes(
        4,
      );
      expect(mockMetricsRepository.saveMetric).toHaveBeenCalledTimes(4);

      expect(mockMetricsRepository.saveMetric).toHaveBeenCalledWith(
        24.5,
        expect.any(Date),
        'sensor-uuid-999',
      );
    });
  });
});
