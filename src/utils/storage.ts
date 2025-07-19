import Cookies from "js-cookie";

export interface StorageOptions {
  expires?: number; // days
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  path?: string;
}

export interface StorageData {
  [key: string]: any;
}

class StorageManager {
  private static instance: StorageManager;
  
  private constructor() {}
  
  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  // Cookie methods
  setCookie(key: string, value: any, options: StorageOptions = {}): void {
    const defaultOptions: StorageOptions = {
      expires: 0.5, // 12 hours default
      secure: true,
      sameSite: "strict",
      path: "/",
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    try {
      const stringValue = typeof value === "string" ? value : JSON.stringify(value);
      Cookies.set(key, stringValue, finalOptions);
    } catch (error) {
      console.error("Error setting cookie:", error);
    }
  }

  getCookie(key: string): any {
    try {
      const value = Cookies.get(key);
      if (!value) return null;
      
      // Try to parse as JSON, if it fails return as string
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error("Error getting cookie:", error);
      return null;
    }
  }

  removeCookie(key: string, options: StorageOptions = {}): void {
    const defaultOptions: StorageOptions = {
      path: "/",
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    Cookies.remove(key, finalOptions);
  }

  // LocalStorage methods
  setLocalStorage(key: string, value: any): void {
    try {
      const stringValue = typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    } catch (error) {
      console.error("Error setting localStorage:", error);
    }
  }

  getLocalStorage(key: string): any {
    try {
      const value = localStorage.getItem(key);
      if (!value) return null;
      
      // Try to parse as JSON, if it fails return as string
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error("Error getting localStorage:", error);
      return null;
    }
  }

  removeLocalStorage(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing localStorage:", error);
    }
  }

  // SessionStorage methods
  setSessionStorage(key: string, value: any): void {
    try {
      const stringValue = typeof value === "string" ? value : JSON.stringify(value);
      sessionStorage.setItem(key, stringValue);
    } catch (error) {
      console.error("Error setting sessionStorage:", error);
    }
  }

  getSessionStorage(key: string): any {
    try {
      const value = sessionStorage.getItem(key);
      if (!value) return null;
      
      // Try to parse as JSON, if it fails return as string
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error("Error getting sessionStorage:", error);
      return null;
    }
  }

  removeSessionStorage(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing sessionStorage:", error);
    }
  }

  // Utility methods
  clearAll(): void {
    try {
      // Clear all cookies
      const cookies = Cookies.get();
      Object.keys(cookies).forEach(key => {
        this.removeCookie(key);
      });
      
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
    } catch (error) {
      console.error("Error clearing all storage:", error);
    }
  }

  // Check if storage is available
  isLocalStorageAvailable(): boolean {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  isSessionStorageAvailable(): boolean {
    try {
      const test = "__storage_test__";
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  // Get storage size (for localStorage and sessionStorage)
  getStorageSize(type: "localStorage" | "sessionStorage"): number {
    try {
      let total = 0;
      const storage = type === "localStorage" ? localStorage : sessionStorage;
      
      for (let key in storage) {
        if (storage.hasOwnProperty(key)) {
          total += storage[key].length + key.length;
        }
      }
      
      return total;
    } catch (error) {
      console.error(`Error getting ${type} size:`, error);
      return 0;
    }
  }
}

// Export singleton instance
export const storage = StorageManager.getInstance();

// Export convenience functions
export const setCookie = (key: string, value: any, options?: StorageOptions) => 
  storage.setCookie(key, value, options);

export const getCookie = (key: string) => storage.getCookie(key);

export const removeCookie = (key: string, options?: StorageOptions) => 
  storage.removeCookie(key, options);

export const setLocalStorage = (key: string, value: any) => 
  storage.setLocalStorage(key, value);

export const getLocalStorage = (key: string) => storage.getLocalStorage(key);

export const removeLocalStorage = (key: string) => storage.removeLocalStorage(key);

export const setSessionStorage = (key: string, value: any) => 
  storage.setSessionStorage(key, value);

export const getSessionStorage = (key: string) => storage.getSessionStorage(key);

export const removeSessionStorage = (key: string) => storage.removeSessionStorage(key);

export const clearAllStorage = () => storage.clearAll();

export default storage; 