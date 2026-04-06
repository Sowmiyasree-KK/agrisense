/**
 * SoilDataContext — shared data layer for all pages.
 *
 * Polls the Flask API every 10 seconds. Any page that calls
 * useSoilData() gets the same live data without triggering
 * a separate fetch. This keeps Dashboard and AI Recommendations
 * perfectly in sync.
 */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { fetchSoilData } from "./api";

const POLL_INTERVAL = 10000;

const SoilDataContext = createContext(null);

export function SoilDataProvider({ children }) {
  const [data, setData]           = useState(null);
  const [history, setHistory]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const intervalRef               = useRef(null);

  const load = useCallback(async () => {
    try {
      const json = await fetchSoilData();
      setData(json);
      setHistory((prev) => [...prev, json].slice(-10));
      setError(null);
      setLastFetch(new Date());
    } catch (err) {
      setError(err?.message || "Failed to reach the backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    intervalRef.current = setInterval(load, POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [load]);

  const refresh = useCallback(() => {
    setLoading(true);
    load();
  }, [load]);

  return (
    <SoilDataContext.Provider value={{ data, history, loading, error, lastFetch, refresh }}>
      {children}
    </SoilDataContext.Provider>
  );
}

export function useSoilData() {
  return useContext(SoilDataContext);
}
