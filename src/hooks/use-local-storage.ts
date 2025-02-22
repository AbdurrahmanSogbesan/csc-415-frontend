import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  //   Sync with other tabs
  //   useEffect(() => {
  //     const handleStorageChange = (event: StorageEvent) => {
  //       if (event.key === key) {
  //         setStoredValue(event.newValue ? JSON.parse(event.newValue) : initialValue);
  //       }
  //     };

  //     window.addEventListener("storage", handleStorageChange);
  //     return () => {
  //       window.removeEventListener("storage", handleStorageChange);
  //     };
  //   }, [key, initialValue]);

  return [storedValue, setStoredValue] as const;
}
