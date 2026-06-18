import { Metric } from "@/types/main.types";

export const mockMetricsDatabase: Metric[] = [
  {
    sensorType: "airHum",
    value: 45,
    date: new Date("2026-06-06T00:30:00Z"),
  },
  {
    sensorType: "airHum",
    value: 50,
    date: new Date("2026-06-06T00:35:00Z"),
  },
  {
    sensorType: "airHum",
    value: 55,
    date: new Date("2026-06-06T00:40:00Z"),
  },
  {
    sensorType: "temp",
    value: 24,
    date: new Date("2026-06-06T00:30:00Z"),
  },
  {
    sensorType: "soilHum",
    value: 62,
    date: new Date("2026-06-06T00:30:00Z"),
  },
];
