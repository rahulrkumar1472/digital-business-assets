export type FunnelTrack = "track1" | "track2" | "unknown";

export const funnelStorageKey = "dba_funnel_track";

export function inferTrackFromPath(pathname: string): FunnelTrack {
  if (!pathname) {
    return "unknown";
  }

  if (pathname.startsWith("/tools/website-audit")) {
    return "track2";
  }

  if (pathname.startsWith("/growth-simulator")) {
    return "track2";
  }

  if (pathname.startsWith("/services/website-starter-build")) {
    return "track1";
  }

  return "unknown";
}

export function getStoredTrack(): FunnelTrack {
  if (typeof window === "undefined") {
    return "unknown";
  }

  const raw = window.localStorage.getItem(funnelStorageKey);
  if (raw === "track1" || raw === "track2") {
    return raw;
  }

  return "unknown";
}

export function setStoredTrack(track: FunnelTrack) {
  if (typeof window === "undefined") {
    return;
  }

  if (track === "unknown") {
    window.localStorage.removeItem(funnelStorageKey);
    return;
  }

  window.localStorage.setItem(funnelStorageKey, track);
}

