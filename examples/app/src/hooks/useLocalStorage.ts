/* eslint-disable no-console */
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useEventCallback, useEventListener } from "usehooks-ts";

declare global {
  interface WindowEventMap {
    "local-storage": CustomEvent;
  }
}

export type SetValue<T> = Dispatch<SetStateAction<T>>;

function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue: SetValue<T> = useEventCallback((value) => {
    // Prevent build error "window is undefined" but keeps working
    if (typeof window === "undefined") {
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`
      );
    }

    try {
      const newValue = value instanceof Function ? value(storedValue) : value;
      window.localStorage.setItem(key, JSON.stringify(newValue));
      setStoredValue(newValue);
      window.dispatchEvent(new Event("local-storage"));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  });

  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStorageChange = useCallback(
    (event: StorageEvent | CustomEvent) => {
      if ((event as StorageEvent)?.key && (event as StorageEvent).key !== key) {
        return;
      }
      setStoredValue(readValue());
    },
    [key, readValue]
  );

  useEventListener("storage", handleStorageChange);
  useEventListener("local-storage", handleStorageChange);

  return [storedValue, setValue];
}

export default useLocalStorage;
