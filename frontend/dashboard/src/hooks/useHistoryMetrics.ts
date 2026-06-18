import { useState, useEffect } from "react";
import { getReadingsBySensor } from "../services/metrics.service";
import { metricsObservable } from "./../class/metricsObserver";
import { Metric, sensorType } from "@/types/main.types";

export const useHistoryMetrics = (idDevice: string, sensorType: sensorType) => {
  const [history, setHistory] = useState<Metric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      const data = await getReadingsBySensor(idDevice, sensorType);
      setHistory(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred fetching history");
    } finally {
      setLoading(false);
    }
  };

  // 1. Initial historical data fetching via central service
  useEffect(() => {

    const init = async () => {
      await fetchHistoryData();
    };
    init();
  }, [idDevice, sensorType]);

  // 2. PURE OBSERVER PATTERN: Subscribe to real-time events via the shared Observable class
  useEffect(() => {
    const unsubscribe = metricsObservable.subscribe(async () => {
      fetchHistoryData();
    });

    // Unsubscribe from the Observable when the chart component unmounts to prevent memory leaks
    return () => unsubscribe();
  }, [sensorType]);

  return { history, loading, error };
};
