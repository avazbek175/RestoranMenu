# 🍽️Restoran - Telegram WebApp Restoran Tizimi

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

Bu zamonaviy, premium dizaynga ega (Charcoal-Dark va Oltin ranglar kombinatsiyasida) restoranlar uchun to'liq avtomatlashtirilgan Telegram WebApp va Buyurtmalarni Boshqarish tizimidir. Tizim stollardagi QR-kodlar orqali stol raqamini avtomat aniqlaydi va mijozlarga bevosita Telegram ichida buyurtma rasmiylashtirish imkonini beradi.

---

## 🛠️ Texnologiyalar

* **Frontend**: React (Vite) + Tailwind CSS (v3) + Socket.io Client + Lucide Icons + Web Audio API (Ovoz sintezi)
* **Backend**: Node.js + Express.js + Socket.io Server (Real-time buyurtmalar) + Mongoose
* **Ma'lumotlar bazasi**: MongoDB
* **Integratsiya**: Telegram Bot API + Telegram WebApp SDK

---

## 📁 Loyiha Tuzilishi (Project Structure)

Loyiha clean architecture tamoyillari asosida ikkita mustaqil qismga (backend va frontend) ajratilgan:

```
telegram-restaurant/
├── backend/                  # Node.js + Express Backend va Bot logikasi
│   ├── bot/
│   │   └── telegramBot.js    # Telegram Bot va admin klaviaturasi boshqaruvi
│   ├── config/
│   │   └── db.js             # MongoDB ulanishi
│   ├── controllers/
│   │   ├── adminController.js# Admin avtorizatsiya va login controller
│   │   ├── foodController.js # Taomlar menyusi controller
│   │   ├── orderController.js# Buyurtmalar va websocket controller
│   │   └── tableController.js# Stol va QR linklar controller
│   ├── middleware/
│   │   └── authMiddleware.js # JWT admin xavfsizlik middleware
│   ├── models/               # MongoDB Mongoose sxemalari
│   │   ├── Food.js
│   │   ├── Order.js
│   │   ├── Table.js
│   │   └── User.js
│   ├── routes/               # API Routerlar
│   │   ├── adminRoutes.js
│   │   ├── foodRoutes.js
│   │   ├── orderRoutes.js
│   │   └── tableRoutes.js
│   ├── package.json
│   └── server.js             # Express Server, Socket.io va Bot boshlang'ich nuqtasi
│
└── frontend/                 # React + Tailwind CSS WebApp / Admin Panel
    ├── public/
    │   └── index.html        # Telegram SDK ulanish nuqtasi
    ├── src/
    │   ├── components/       # Ko'p foydalaniladigan komponentlar
    │   │   ├── CartItem.jsx
    │   │   ├── FoodCard.jsx
    │   │   ├── Header.jsx
    │   │   ├── OrderStatusModal.jsx # Real-time buyurtmani kuzatish modal oynasi
    │   │   └── Toast.jsx
    │   ├── context/
    │   │   └── CartContext.jsx  # Savat, Telegram User va stolni aniqlash context
    │   ├── pages/            # Asosiy sahifalar
    │   │   ├── AdminDashboard.jsx # Admin boshqaruv paneli (Real-time ovoz bilan)
    │   │   ├── AdminLogin.jsx     # Xavfsiz JWT Admin login
    │   │   ├── Cart.jsx           # Savat bo'limi
    │   │   ├── Categories.jsx     # Kategoriyalar filtri
    │   │   ├── Checkout.jsx       # Buyurtmani rasmiylashtirish va Success sahifasi
    │   │   ├── Foods.jsx          # Taomlar ro'yxati va qidiruv
    │   │   └── Home.jsx           # Asosiy xush kelibsiz sahifasi
    │   ├── App.jsx           # Sahifalar o'rtasida navigatsiya va layout
    │   ├── index.css         # Premium CSS animatsiyalar va gold styling
    │   └── main.jsx
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js    # Maxsus dark/gold palette sozlamalari
    └── vite.config.js
```

---

## 🚀 O'rnatish va Mahalliy Muhitda Ishga Tushirish

### 1. MongoDB-ni ishga tushiring
Lokal MongoDB serveringiz ishlayotganiga ishonch hosil qiling (`mongodb://localhost:27017`) yoki MongoDB Atlas ulash havolasini tayyorlang.

### 2. Backend sozlash va ishga tushirish
1. `backend` papkasiga o'ting.
2. `.env` faylini yarating va quyidagi qiymatlarni kiriting:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/telegram-restaurant
   JWT_SECRET=super_secret_jwt_key_gold_restaurant_13579
   TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN_HERE
   ADMIN_TELEGRAM_IDS=12345678,87654321  # Adminlarning Telegram ID-lari (vergul bilan)
   FRONTEND_URL=http://localhost:5173
   ```
3. Kerakli kutubxonalarni yuklang va loyihani ishga tushiring:
   ```bash
   npm install
   npm run dev
   ```

### 3. Frontend (React) sozlash va ishga tushirish
1. `frontend` papkasiga o'ting.
2. Mahalliy paketlarni o'rnating:
   ```bash
   npm install
   ```
3. Vite loyihani ishga tushiring:
   ```bash
   npm run dev
   ```
   *Frontend `http://localhost:5173` manzilida ishlaydi.*

---

## 🔌 Telegram Bot va QR-kod Tizimini Sozlash

1. **Bot yaratish**: `@BotFather` orqali yangi Telegram bot yarating va `TELEGRAM_BOT_TOKEN` ni backend `.env` ga qo'shing.
2. **WebApp tugmasini sozlash**:
   * `@BotFather` botiga `/newapp` komandasini yuboring.
   * O'zingiz yaratgan botni tanlang.
   * WebApp sarlavhasini kiriting (masalan: `L Empire de l Or`).
   * Rasm va tavsiflarni yuklang.
   * **URL manzilini kiriting**: Ishlab chiqarishda (production) bu sizning frontend havolangiz bo'ladi (masalan: `https://l-empire-de-lor.web.app`). Mahalliy tekshirishda ngrok orqali tunnel hosil qilib kiritishingiz mumkin (masalan: `https://xxxx.ngrok-free.app`).
   * Qisqa nom (short name) bering (masalan: `menu`).
3. **QR Kodlar**:
   * Har bir stol ustida QR kod bo'ladi. Havola quyidagi ko'rinishda yoziladi:
     `https://t.me/YOUR_BOT_USERNAME?start=table_5`
   * Mijoz ushbu QR kodni skaner qilganda Telegram bot ochiladi va avtomatik ravishda `/start table_5` ishlaydi.
   * Bot mijozga **"🍽 Menu"** tugmasini chiqaradi va unga `http://localhost:5173?table=5` havolasini biriktiradi.
   * WebApp ochilganda stol raqami avtomatik ravishda **5-stol** deb aniqlanadi va buyurtmada aks etadi.

---

## 🛡️ Admin Boshqaruvi va Xavfsizligi

### 💻 Admin Panel (Vite Dashboard)
* Admin panelga kirish: Ilovadagi **Admin** tab-iga o'ting.
* **Standart login ma'lumotlari**:
  * Tizimga xavfsiz kirish uchun loyiha o'rnatilgandagi maxfiy ma'lumotlardan foydalaning (tavsiya etilgan login/parol xavfsizlik maqsadida ushbu ochiq hujjatdan olib tashlandi).
* Admin Dashboard-da buyurtmalar real-vaqtda yangilanadi (Websockets).
* Yangi buyurtma kelganda maxsus tilla rang bildirishnoma chiqadi va brauzerda **premium ovozli chime signali** yangraydi (Web Audio API).
* Admin har bir buyurtmani statusini o'zgartirishi mumkin: `Pending` -> `Preparing` -> `Delivered`.
* `Delivered` statusiga o'tgan buyurtmalar faol ro'yxatdan o'chib arxivga o'tadi (DB dan o'chmaydi).

### 🤖 Telegram Admin Control
* Agar buyurtma berilsa, bot bazadan adminlar ro'yxatini olib (`ADMIN_TELEGRAM_IDS` bo'yicha) ularga Telegram-dan xabar yuboradi.
* Xabarda stol raqami, taomlar ro'yxati, jami summa va vaqt aks etadi.
* Inline klaviaturada **👨‍🍳 Preparing** va **✅ Delivered** tugmalari chiqadi.
* Admin ushbu tugmalarni Telegram ichida bossa, bazadagi buyurtma holati hamda brauzerda ochiq turgan admin paneli **avtomatik tarzda sinxron yangilanadi**!

---

## 📦 Production Deployment Guide (Serverga yuklash)

Loyiha to'liq production levelda qurilgan va istalgan serverga oson joylashadi.

### 🌐 Backend (Heroku, Render, Railway yoki VPS)
1. Kodlaringizni GitHub-ga yuklang.
2. Render.com yoki Railway.app platformasida yangi Node.js xizmatini yarating.
3. Env variables bo'limiga `.env` tarkibidagi o'zgaruvchilarni kiriting.
4. MongoDB ulanishi uchun MongoDB Atlas-dan foydalaning va `MONGO_URI`ga uning havolasini bering.

### 💻 Frontend (Vercel, Netlify yoki Firebase Hosting)
1. Frontend papkasida `.env` yoki config-da API URL manzilini sozlang:
   * `frontend/vite.config.js` yoki `App.jsx` ichidagi server havolasini backend yuklangan URL manzilga o'zgartiring (masalan: `https://api.restoranimiz.uz`).
2. Vercel yoki Netlify-da yangi loyiha yarating.
3. Build command: `npm run build` va Output directory: `dist`.
4. Deploy tugmasini bosing. Olingan havolani Telegram Bot WebApp URL sifatida sozlang.
