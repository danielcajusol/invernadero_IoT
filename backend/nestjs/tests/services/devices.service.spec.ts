import { Test, TestingModule } from '@nestjs/testing';
import { DevicesService } from '../../src/services/devices.service';
import { DevicesRepository } from 'src/repositories/device.repository';
import { NotFoundException } from '@nestjs/common';

describe('DevicesService', () => {
  let service: DevicesService;

  const mockDevicesRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DevicesService,
        {
          provide: DevicesRepository,
          useValue: mockDevicesRepository,
        },
      ],
    }).compile();

    service = module.get<DevicesService>(DevicesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('changePumpStatus', () => {
    it('should throw a NotFoundException if the device does not exist', async () => {
      mockDevicesRepository.findOne.mockResolvedValue(null);

      await expect(service.changePumpStatus('fake-id', true)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockDevicesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'fake-id' },
      });

      expect(mockDevicesRepository.save).not.toHaveBeenCalled();
    });

    it('should update the pump status and return the saved device', async () => {
      const existingDevice = { id: 'device-123', pumpStatus: false };
      const expectedUpdatedDevice = { id: 'device-123', pumpStatus: true };

      mockDevicesRepository.findOne.mockResolvedValue(existingDevice);
      mockDevicesRepository.save.mockResolvedValue(expectedUpdatedDevice);

      const result = await service.changePumpStatus('device-123', true);

      expect(result).toEqual(expectedUpdatedDevice);
      expect(mockDevicesRepository.save).toHaveBeenCalledWith({
        id: 'device-123',
        pumpStatus: true, // The field must match the new target state
      });
    });
  });
});
