import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadImageToStorage = async (file: File): Promise<string> => {
  try {
    // Generate a unique file path
    const filePath = `uploads/${Date.now()}-${file.name}`;
    
    // Create a reference to the storage location
    const storageRef = ref(storage, filePath);
    
    // Upload the file to Firebase Storage
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL for the uploaded file
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL; // Return the file's public URL
  } catch (error) {
    console.error("Error uploading to Firebase Storage:", error);
    throw new Error("Failed to upload image to storage");
  }
};

export { storage };