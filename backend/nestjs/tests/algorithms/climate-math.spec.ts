import { describe, it, expect } from '@jest/globals';
import {
  isAnomalousReading,
  calculateMovingAverage,
  calculateDewPoint,
} from '../../src/algorithms/climate-math';

describe('Algoritmos Climáticos Avanzados (RNF8)', () => {
  // ==========================================
  // TESTS PARA FILTRO ESTADÍSTICO (Anomalías)
  // ==========================================
  describe('isAnomalousReading()', () => {
    it('debería devolver FALSE si es la primera lectura (null o 0)', () => {
      expect(isAnomalousReading(25, null)).toBe(false);
      expect(isAnomalousReading(25, 0)).toBe(false);
    });

    it('debería devolver FALSE si la variación es menor o igual al 50%', () => {
      // De 20 a 25 hay un 25% de aumento (Normal)
      expect(isAnomalousReading(25, 20)).toBe(false);
      // De 30 a 20 hay un 33.3% de bajada (Normal)
      expect(isAnomalousReading(20, 30)).toBe(false);
    });

    it('debería devolver TRUE si el salto supera el umbral del 50% (Fallo eléctrico)', () => {
      // De 20 a 35 hay un 75% de aumento
      expect(isAnomalousReading(35, 20)).toBe(true);
      // De 20 a 5 hay un 75% de bajada
      expect(isAnomalousReading(5, 20)).toBe(true);
    });
  });

  // ==========================================
  // TESTS PARA MEDIA MÓVIL (Suavizado de curvas)
  // ==========================================
  describe('calculateMovingAverage()', () => {
    it('debería devolver un array vacío si no hay datos', () => {
      expect(calculateMovingAverage([])).toEqual([]);
    });

    it('debería devolver los mismos datos si el tamaño de ventana es 1 o menor', () => {
      expect(calculateMovingAverage([10, 20], 1)).toEqual([10, 20]);
    });

    it('debería calcular correctamente la media móvil progresiva', () => {
      const data = [10, 20, 30];
      // Explicación de la ventana tamaño 2:
      // Paso 1: [10] -> Promedio: 10
      // Paso 2: [10, 20] -> Promedio: 15
      // Paso 3: [20, 30] -> Promedio: 25
      expect(calculateMovingAverage(data, 2)).toEqual([10, 15, 25]);
    });
  });

  // ==========================================
  // TESTS PARA PUNTO DE ROCÍO (Magnus-Tetens)
  // ==========================================
  describe('calculateDewPoint()', () => {
    it('debería devolver estado NORMAL si la temperatura está lejos del rocío', () => {
      const result = calculateDewPoint(25, 50); // Temp 25°C, Hum 50%

      expect(result.status).toBe('NORMAL');
      expect(typeof result.dewPoint).toBe('number');
      // Aseguramos que la diferencia entre temp y rocío sea mayor a 2 grados
      expect(25 - result.dewPoint).toBeGreaterThan(2);
    });

    it('debería devolver RIESGO_DE_HONGOS si hay alta humedad y el rocío se acerca a la temperatura', () => {
      const result = calculateDewPoint(20, 95); // Alta humedad = inminente condensación

      expect(result.status).toBe('RIESGO_DE_HONGOS');
      // Con 20°C y 95% de humedad, el rocío está pisándole los talones a los 20°C (diferencia <= 2)
      expect(20 - result.dewPoint).toBeLessThanOrEqual(2);
    });
  });
});
