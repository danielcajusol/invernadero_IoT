// Define how the subscriber (Observer) callback function looks

export interface MetricItem {
  value: number;
  date: string | Date;
}


export type MetricsObserverCallback = (data: MetricItem[]) => void;

class MetricsObservable {
  // Array of active observers (subscribers)
  private observers: MetricsObserverCallback[] = [];

  /**
   * Method for Observers to subscribe to updates
   * Returns an unsubscribe function for easy cleanup in React
   */
  public subscribe(callback: MetricsObserverCallback): () => void {
    this.observers.push(callback);

    // Return the unsubscription mechanism immediately
    return () => {
      this.observers = this.observers.filter((obs) => obs !== callback);
    };
  }

  /**
   * Method for the Subject to notify all active subscribers
   */
  public notify(data: MetricItem[]): void {
    this.observers.forEach((callback) => callback(data));
  }
}

// Export a single shared instance to decouple the modules completely
export const metricsObservable = new MetricsObservable();
