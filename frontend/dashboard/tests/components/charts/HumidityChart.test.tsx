import { render } from "@testing-library/react";
import { HumidityChart } from "@/components/charts/HumidityChart";
import { mockMetricsDatabase } from "../../mocks/mockMetricsDatabase";

jest.mock("recharts", () => {
  const original = jest.requireActual<Record<string, unknown>>("recharts");

  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => children,
  };
});

describe("HumidityChart", () => {
  it("renders chart", () => {
    const humidityData = mockMetricsDatabase.filter(
      (m) => m.sensorType === "airHum"
    );

    const { container } = render(
      <HumidityChart data={humidityData} />
    );

    expect(container).toBeInTheDocument();
  });
});
