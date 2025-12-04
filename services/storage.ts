import { MMKV } from 'react-native-mmkv';

// Inisialisasi MMKV storage dengan ID untuk persistence
export const storage = new MMKV({
  id: 'user-storage',
});

// Storage keys
const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_EMAIL: 'user_email',
  USER_ID: 'user_id',
  IS_LOGGED_IN: 'is_logged_in',
};

// Simpan informasi login user
export const saveUserLogin = (userId: string, email: string, token: string) => {
  storage.set(STORAGE_KEYS.USER_ID, userId);
  storage.set(STORAGE_KEYS.USER_EMAIL, email);
  storage.set(STORAGE_KEYS.USER_TOKEN, token);
  storage.set(STORAGE_KEYS.IS_LOGGED_IN, true);
};

// Ambil informasi login user
export const getUserLogin = () => {
  return {
    userId: storage.getString(STORAGE_KEYS.USER_ID),
    email: storage.getString(STORAGE_KEYS.USER_EMAIL),
    token: storage.getString(STORAGE_KEYS.USER_TOKEN),
    isLoggedIn: storage.getBoolean(STORAGE_KEYS.IS_LOGGED_IN) || false,
  };
};

// Hapus informasi login user (logout)
export const clearUserLogin = () => {
  storage.delete(STORAGE_KEYS.USER_ID);
  storage.delete(STORAGE_KEYS.USER_EMAIL);
  storage.delete(STORAGE_KEYS.USER_TOKEN);
  storage.set(STORAGE_KEYS.IS_LOGGED_IN, false);
};

// Cek apakah user sudah login
export const isUserLoggedIn = (): boolean => {
  return storage.getBoolean(STORAGE_KEYS.IS_LOGGED_IN) || false;
};
