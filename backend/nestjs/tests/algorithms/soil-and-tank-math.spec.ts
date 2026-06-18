import { describe, it, expect } from '@jest/globals';
import { clasificarSuelo, isTankLevelCritical } from '../../src/algorithms/soil-and-tank-math';

describe('Algoritmos de Suelo y Tanque (RNF8)', () => {
  // ==========================================
  // TESTS PARA EL SUELO
  // ==========================================
  describe('clasificarSuelo()', () => {
    it('debería devolver "Seco - Requiere riego" si la humedad es menor a 30', () => {
      expect(clasificarSuelo(15)).toBe('Seco - Requiere riego');
      expect(clasificarSuelo(29)).toBe('Seco - Requiere riego');
    });

    it('debería devolver "Óptimo" si la humedad está entre 30 y 70', () => {
      expect(clasificarSuelo(50)).toBe('Óptimo');
      // Casos borde (justo en el límite)
      expect(clasificarSuelo(30)).toBe('Óptimo');
      expect(clasificarSuelo(70)).toBe('Óptimo');
    });

    it('debería devolver "Inundado" si la humedad es mayor a 70', () => {
      expect(clasificarSuelo(71)).toBe('Inundado');
      expect(clasificarSuelo(95)).toBe('Inundado');
    });
  });

  // ==========================================
  // TESTS PARA EL TANQUE DE AGUA
  // ==========================================
  describe('isTankLevelCritical()', () => {
    it('debería devolver TRUE (crítico) si el nivel es menor a 15%', () => {
      expect(isTankLevelCritical(10)).toBe(true);
      expect(isTankLevelCritical(14.9)).toBe(true);
    });

    it('debería devolver FALSE (OK) si el nivel es 15% o mayor', () => {
      expect(isTankLevelCritical(15)).toBe(false); // Caso borde
      expect(isTankLevelCritical(80)).toBe(false);
    });
  });
});
