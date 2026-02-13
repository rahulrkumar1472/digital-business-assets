export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const eventData = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer;
  if (Array.isArray(dataLayer)) {
    dataLayer.push(eventData);
  }

  window.dispatchEvent(
    new CustomEvent("dba:analytics", {
      detail: eventData,
    }),
  );

  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", eventData);
  }
}
