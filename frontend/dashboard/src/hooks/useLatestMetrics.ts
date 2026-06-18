import { useState, useEffect } from "react";
import { metricsObservable } from "../class/metricsObserver"; // Import our pure class instance
import { getLatestReadings } from "@/services/metrics.service";
import { Metric, sensorType } from "@/types/main.types";

export const useLatestMetrics = (
  idDevice: string,
  sensorTypes: sensorType[],
) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const typesQuery = sensorTypes.join(",");

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const data = (await getLatestReadings(idDevice, sensorTypes)) as Metric[] ;

        setMetrics(data);
        setError(null);

        // Notify suscriptors (Observer)
        metricsObservable.notify(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error ocurred fetching latest metrics");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestData();
    const intervalId = setInterval(fetchLatestData, 5000);

    return () => clearInterval(intervalId);
  }, [idDevice, typesQuery]);

  return { metrics, loading, error };
};
