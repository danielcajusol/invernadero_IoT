import {
  getLatestReadings,
  getReadingsBySensor,
} from "@/services/metrics.service";

global.fetch = jest.fn();

describe("metrics.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls latest endpoint", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    await getLatestReadings(
      "ESP32-INV-01",
      ["temp"]
    );

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        "/metrics/ESP32-INV-01/latest"
      )
    );
  });

  it("calls history endpoint", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    await getReadingsBySensor(
      "ESP32-INV-01",
      "airHum"
    );

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        "/metrics/ESP32-INV-01/history"
      )
    );
  });
});
