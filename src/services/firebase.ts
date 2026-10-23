import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

// Firebase configuration loaded from environment variables
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// Safe singleton initialization for Next.js App Router (Client & SSR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

/**
 * Upload any File or Blob to Firebase Storage and retrieve public download URL
 */
export const uploadFileToStorage = async (
  file: File | Blob,
  storagePath: string
): Promise<string> => {
  try {
    const fileRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Firebase Storage upload error:", error);
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage given its full URL or path
 */
export const deleteFileFromStorage = async (filePathOrUrl: string): Promise<void> => {
  try {
    const fileRef = ref(storage, filePathOrUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.warn("Firebase Storage delete warning (file may not exist):", error);
  }
};

/**
 * Helper to determine active tenant ID matching DoctorApp multi-tenant hierarchy
 */
export const getActiveTenantId = (): string => {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const urlTenantId = params.get("salonId") || params.get("doctorId");
    if (urlTenantId) return urlTenantId;
  }
  return process.env.NEXT_PUBLIC_SALON_ID || "salon001";
};

export default app;
