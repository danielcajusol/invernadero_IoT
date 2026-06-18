import { renderHook, waitFor } from "@testing-library/react";
import { useLatestMetrics } from "@/hooks/useLatestMetrics";
import { getLatestReadings } from "@/services/metrics.service";

jest.mock("@/services/metrics.service");

describe("useLatestMetrics", () => {
  it("loads latest metrics", async () => {
    (getLatestReadings as jest.Mock).mockResolvedValue([
      {
        sensorType: "temp",
        value: 25,
        date: new Date(),
      },
    ]);

    const { result } = renderHook(() =>
      useLatestMetrics("ESP32-INV-01", ["temp"])
    );

    await waitFor(() =>
      expect(result.current.loading).toBe(false)
    );

    expect(result.current.metrics).toHaveLength(1);
    expect(result.current.metrics[0].value).toBe(25);
  });
});