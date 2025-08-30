# 🐾 WhereIsMyPet

**WhereIsMyPet**, kayıp veya bulunan evcil hayvan ilanlarının hızlıca paylaşılmasını ve konum tabanlı olarak görülmesini sağlayan bir web platformudur.

## 🚀 Temel Özellikler

- 📝 Kayıp/bulunan hayvan ilanı oluşturma (başlık, açıklama, fotoğraf, konum)
- 🔍 İlanları listeleme ve arama/filtreleme
- 📄 İlan detay sayfası (iletişim, konum, tarih vb.)
- 📧 E-posta doğrulama akışı (güvenli kullanıcı deneyimi)
- 📂 Kişisel ilanlarım sayfası (ilanları düzenleme/silme)
- 🛠️ Yönetici paneli (temel moderasyon akışları)
- ℹ️ Yardım, SSS, Hakkında ve Bağış sayfaları

---

## 🏗️ Mimari ve Teknolojiler

- **React 18 + TypeScript**: Bileşen tabanlı, tip güvenli arayüz geliştirme
- **React Router 6**: Çok sayfalı gezinme
- **MUI (Material UI)**: Modern ve erişilebilir UI bileşenleri
- **Firebase (v9 modular)**
  - Authentication (E-posta/şifre ile giriş)
  - Firestore (Veri saklama)
  - Storage (Fotoğraf dosyaları)
- **Testing Library + Jest**: Test altyapısı
- **Web Vitals**: Performans ölçümü
- **Konum Servisi**: Tarayıcı konum API’si (`locationService.ts`)

---

## 📁 Dizin Yapısı (Özet)

public/ # Statik varlıklar (ikonlar, görseller, manifest)
src/
pages/ # Sayfa bileşenleri (HomePage, ViewPosts vb.)
components/ # Ortak bileşenler (Navbar, PostForm vb.)
services/ # İş mantığı servisleri (örn. locationService.ts)
utils/, types/ # Yardımcı fonksiyonlar ve TypeScript tipleri
firebase.ts # Firebase konfigürasyon ve servis dışa aktarımları
App.tsx, index.tsx # Uygulama giriş noktaları

yaml
Kodu kopyala

---

## 🗃️ Veri Modeli (Özet)

### `Post` (İlan)

| Alan         | Açıklama                     |
|--------------|------------------------------|
| title        | Başlık                       |
| description  | Açıklama                     |
| photoUrl     | Fotoğraf URL’si              |
| location     | Enlem, boylam, ilçe/bölge    |
| status       | kayıp / bulundu vb.          |
| ownerId      | İlan sahibinin UID’si        |
| createdAt    | Oluşturulma tarihi           |
| updatedAt    | Güncellenme tarihi           |

### `User`

| Alan           | Açıklama               |
|----------------|------------------------|
| uid            | Kullanıcı kimliği      |
| email          | E-posta adresi         |
| emailVerified  | Doğrulama durumu       |
| displayName    | (Opsiyonel) Görünen ad |

---

## 🛠️ Kurulum

### 1) Gereksinimler

- Node.js 16+
- npm veya yarn

### 2) Bağımlılıkları yükle

```bash
npm install
3) Firebase Ayarları
src/firebase.ts dosyasındaki firebaseConfig alanını Firebase Console'dan aldığınız bilgilerle doldurun:

ts
Kodu kopyala
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
};
Alternatif olarak .env dosyası da kullanabilirsiniz.

4) Uygulamayı çalıştır
bash
Kodu kopyala
npm start
Tarayıcıda: http://localhost:3000

🧭 Kullanım
🔐 Giriş/Üyelik: E-posta ve şifreyle kayıt olun, e-posta doğrulamasını tamamlayın.

🐕 İlan Oluşturma: Başlık, açıklama, fotoğraf ve konum girin. Tarayıcıdan konum izni istenebilir.

🔎 İlan Görüntüleme: View Posts sayfasında filtreleme ve detay görüntüleme.

🧾 İlan Yönetimi: My Posts sayfasından düzenleme veya silme işlemleri.

ℹ️ Yardım & Bilgi: Help, FAQ, About ve Donation sayfaları üzerinden bilgi alın.

📦 Komutlar
bash
Kodu kopyala
npm start        # Geliştirme sunucusu
npm test         # Testleri çalıştırır
npm run build    # Üretim derlemesi
☁️ Dağıtım
npm run build ile build/ klasörü oluşturulur.

Netlify, Vercel veya Firebase Hosting gibi platformlara yüklenebilir.

SPA yönlendirme kuralları unutulmamalıdır (404.html fallback).

🔐 Güvenlik ve Gizlilik
E-posta doğrulama ile güvenli kullanıcı girişi

Firebase Storage ve Firestore için güvenlik kuralları yapılandırılmalı

Konum verisi yalnızca kullanıcı izni ile alınır ve sadece ilan bağlamında kullanılır

🤝 Katkı ve Geliştirme
Issue açarak geri bildirimde bulunun

Fork → Branch → Commit → Pull Request akışını takip edin

Kodlama kuralları: TypeScript, açık bileşen yapısı, MUI tabanlı tutarlı UI

🧯 Sorun Giderme
Boş sayfa veya hata: Tarayıcı konsolu ve ağ sekmesini kontrol edin

Firebase hatası: firebase.ts ayarlarını ve güvenlik kurallarını kontrol edin

Bağımlılık sorunu: node_modules klasörünü silip yeniden yükleyin

Yönlendirme hatası: Dağıtım platformunda SPA yönlendirme kurallarını ekleyin
