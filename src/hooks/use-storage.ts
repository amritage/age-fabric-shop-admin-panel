import { useState, useEffect, useCallback } from 'react';
import { storage, StorageOptions } from '@/utils/storage';

export interface UseStorageOptions {
  storageType: 'cookie' | 'localStorage' | 'sessionStorage';
  cookieOptions?: StorageOptions;
}

export const useStorage = <T = any>(
  key: string, 
  initialValue?: T,
  options: UseStorageOptions = { storageType: 'cookie' }
) => {
  const [storedValue, setStoredValue] = useState<T | null>(() => {
    try {
      let item: T | null = null;
      
      switch (options.storageType) {
        case 'cookie':
          item = storage.getCookie(key);
          break;
        case 'localStorage':
          item = storage.getLocalStorage(key);
          break;
        case 'sessionStorage':
          item = storage.getSessionStorage(key);
          break;
      }
      
      return item !== null ? item : initialValue || null;
    } catch (error) {
      console.error(`Error reading ${options.storageType} key "${key}":`, error);
      return initialValue || null;
    }
  });

  const setValue = useCallback((value: T | ((val: T | null) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      switch (options.storageType) {
        case 'cookie':
          storage.setCookie(key, valueToStore, options.cookieOptions);
          break;
        case 'localStorage':
          storage.setLocalStorage(key, valueToStore);
          break;
        case 'sessionStorage':
          storage.setSessionStorage(key, valueToStore);
          break;
      }
    } catch (error) {
      console.error(`Error setting ${options.storageType} key "${key}":`, error);
    }
  }, [key, storedValue, options]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(null);
      
      switch (options.storageType) {
        case 'cookie':
          storage.removeCookie(key, options.cookieOptions);
          break;
        case 'localStorage':
          storage.removeLocalStorage(key);
          break;
        case 'sessionStorage':
          storage.removeSessionStorage(key);
          break;
      }
    } catch (error) {
      console.error(`Error removing ${options.storageType} key "${key}":`, error);
    }
  }, [key, options]);

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== e.oldValue) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : null;
          setStoredValue(newValue);
        } catch (error) {
          console.error('Error parsing storage change:', error);
        }
      }
    };

    if (options.storageType === 'localStorage' || options.storageType === 'sessionStorage') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [key, options.storageType]);

  return [storedValue, setValue, removeValue] as const;
};

// Specialized hooks for common use cases
export const useAuthStorage = <T = any>(key: string, initialValue?: T) => {
  return useStorage<T>(key, initialValue, {
    storageType: 'cookie',
    cookieOptions: {
      expires: 0.5, // 12 hours
      secure: true,
      sameSite: 'strict',
      path: '/'
    }
  });
};

export const useLocalStorage = <T = any>(key: string, initialValue?: T) => {
  return useStorage<T>(key, initialValue, { storageType: 'localStorage' });
};

export const useSessionStorage = <T = any>(key: string, initialValue?: T) => {
  return useStorage<T>(key, initialValue, { storageType: 'sessionStorage' });
};

export const useCookieStorage = <T = any>(key: string, initialValue?: T, cookieOptions?: StorageOptions) => {
  return useStorage<T>(key, initialValue, {
    storageType: 'cookie',
    cookieOptions
  });
}; 