/**
 * This is the only file allowed to call fetch() for sensor-related API access.
 *
 * Uses `process.env.NEXT_PUBLIC_API_URL` from the monorepo root `.env` (see root `.env.example`).
 *
 * Students must implement:
 * - `getLatestReadings()` — fetch recent readings for the dashboard
 * - `getReadingsBySensor(sensorId)` — filter readings for one sensor
 * - `getAlerts()` — fetch alert payloads for widgets
 */

import { Metric, sensorType } from "@/types/main.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * FETCH REAL-TIME READINGS (For Dashboard Cards / Widgets)
 * maps to: GET /metrics/:idDevice/realtime?sensorType=...
 */
export const getLatestReadings = async (
  idDevice: string,
  sensorTypes: sensorType[],
): Promise<Metric[]> => {
  const typesQuery = sensorTypes.join(",");
  const response = await fetch(
    `${API_BASE_URL}/metrics/${idDevice}/latest?sensorType=${typesQuery}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch latest readings for device ${idDevice}`);
  }
  return response.json() as Promise<Metric[]>;
};

/**
 * FETCH HISTORICAL READINGS (For Charts)
 * maps to: GET /metrics/:idDevice/history?sensorType=...&range=...
 */
export const getReadingsBySensor = async (
  idDevice: string,
  sensorType: sensorType,
) => {
  const response = await fetch(
    `${API_BASE_URL}/metrics/${idDevice}/history?sensorType=${sensorType}`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch historical readings for sensor ${sensorType}`,
    );
  }
  return response.json() as Promise<Metric[]>;
};

/**
 * FETCH ACTIVE ALERTS
 * (Implement this based on your backend alerts endpoint if available)
 */
export const getAlerts = async (idDevice: string): Promise<unknown[]> => {
  const response = await fetch(`${API_BASE_URL}/devices/${idDevice}/alerts`);

  if (!response.ok) {
    throw new Error(`Failed to fetch alerts for device ${idDevice}`);
  }
  return response.json() as Promise<unknown[]>;
};
