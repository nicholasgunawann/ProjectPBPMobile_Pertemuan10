import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User,
    UserCredential,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { clearUserLogin, saveUserLogin } from './storage';

// Register user baru
export const registerUser = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    // Token dan menyimpan ke MMKV
    const token = await userCredential.user.getIdToken();
    saveUserLogin(userCredential.user.uid, email, token);
    
    return userCredential;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Login user
export const loginUser = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    // Token dan menyimpan ke MMKV
    const token = await userCredential.user.getIdToken();
    saveUserLogin(userCredential.user.uid, email, token);
    
    return userCredential;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    clearUserLogin();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
