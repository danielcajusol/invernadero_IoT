import { renderHook, waitFor } from "@testing-library/react";
import { useHistoryMetrics } from "@/hooks/useHistoryMetrics";
import { getReadingsBySensor } from "@/services/metrics.service";
import { mockMetricsDatabase } from "../mocks/mockMetricsDatabase";

jest.mock("@/services/metrics.service");

describe("useHistoryMetrics", () => {
  it("loads history data", async () => {
    (getReadingsBySensor as jest.Mock).mockResolvedValue(
      mockMetricsDatabase.filter(
        (m) => m.sensorType === "airHum"
      )
    );

    const { result } = renderHook(() =>
      useHistoryMetrics("ESP32-INV-01", "airHum")
    );

    await waitFor(() =>
      expect(result.current.loading).toBe(false)
    );

    expect(result.current.history.length).toBe(3);
    expect(result.current.error).toBeNull();
  });
});