"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

import {
  type FunnelTrack,
  getStoredTrack,
  inferTrackFromPath,
  setStoredTrack,
} from "@/lib/funnel/store";

type FunnelContextValue = {
  track: FunnelTrack;
  setTrack: (track: FunnelTrack) => void;
};

const FunnelContext = createContext<FunnelContextValue | null>(null);
const noopSubscribe = () => () => undefined;

export function FunnelProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const inferredTrack = useMemo(() => inferTrackFromPath(pathname || ""), [pathname]);
  const [storedTrack, setStoredTrackState] = useState<FunnelTrack>(() => getStoredTrack());
  const isHydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useEffect(() => {
    if (inferredTrack !== "unknown") {
      setStoredTrack(inferredTrack);
    }
  }, [inferredTrack]);

  const setTrack = useCallback((next: FunnelTrack) => {
    setStoredTrackState(next);
    setStoredTrack(next);
  }, []);

  const track = inferredTrack !== "unknown" ? inferredTrack : isHydrated ? storedTrack : "unknown";

  const value = useMemo(
    () => ({
      track,
      setTrack,
    }),
    [track, setTrack],
  );

  return <FunnelContext.Provider value={value}>{children}</FunnelContext.Provider>;
}

export function useFunnelTrack() {
  const context = useContext(FunnelContext);
  if (!context) {
    return {
      track: "unknown" as FunnelTrack,
      setTrack: () => undefined,
    };
  }
  return context;
}
