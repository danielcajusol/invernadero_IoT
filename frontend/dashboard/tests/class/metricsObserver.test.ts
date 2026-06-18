import { metricsObservable } from "@/class/metricsObserver";

describe("metricsObservable", () => {
  it("notifies subscribers", () => {
    const callback = jest.fn();

    metricsObservable.subscribe(callback);

    const payload = [{ value: 10 }];

    metricsObservable.notify(payload);

    expect(callback).toHaveBeenCalledWith(payload);
  });
});