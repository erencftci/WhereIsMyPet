import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase proje konfigürasyonu
// Bu bilgiler Firebase Console'dan alınmıştır
// Proje kimlik bilgileri ve API anahtarları
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Firebase uygulamasının başlatılması
const app = initializeApp(firebaseConfig);

// Firebase servislerinin dışa aktarılması
// auth: Kullanıcı kimlik doğrulama işlemleri için
// db: Firestore veritabanı işlemleri için
// storage: Dosya depolama işlemleri için
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 