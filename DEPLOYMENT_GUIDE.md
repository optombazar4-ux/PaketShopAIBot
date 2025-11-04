# PaketShop AI Bot - VPS (Ubuntu/Debian) Deployment Guide

Bu yo'riqnoma Replit'dan Beget VPS serveriga loyihani joylashtirish uchun to'liq qadamma-qadam ko'rsatma.

---

## 1. VPS'ga Zarur Dasturlarni O'rnatish

SSH orqali serveringizga kiring:

```bash
ssh root@your-server-ip
```

### 1.1. Tizimni Yangilash

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2. Node.js v20 (LTS) O'rnatish

```bash
# NodeSource repository'sini qo'shish
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Node.js o'rnatish (npm avtomatik o'rnatiladi)
sudo apt install -y nodejs

# Versiyani tekshirish
node -v  # v20.x.x bo'lishi kerak
npm -v   # 10.x.x bo'lishi kerak
```

### 1.3. Git O'rnatish

```bash
sudo apt install -y git

# Versiyani tekshirish
git --version
```

### 1.4. PostgreSQL O'rnatish va Sozlash

```bash
# PostgreSQL o'rnatish
sudo apt install -y postgresql postgresql-contrib

# PostgreSQL xizmatini ishga tushirish
sudo systemctl start postgresql
sudo systemctl enable postgresql

# PostgreSQL foydalanuvchisiga o'tish va database yaratish
sudo -u postgres psql

# PostgreSQL konsolida:
CREATE DATABASE paketshop_bot;
CREATE USER paketshop_user WITH ENCRYPTED PASSWORD 'your_strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE paketshop_bot TO paketshop_user;
\q
```

**Muhim:** `your_strong_password_here` o'rniga kuchli parol o'rnating va uni eslab qoling!

### 1.5. PM2 (Process Manager) O'rnatish

```bash
sudo npm install -g pm2

# PM2 versiyasini tekshirish
pm2 -v
```

### 1.6. Nginx O'rnatish

```bash
sudo apt install -y nginx

# Nginx'ni ishga tushirish
sudo systemctl start nginx
sudo systemctl enable nginx

# Status tekshirish
sudo systemctl status nginx
```

---

## 2. Loyihani GitHub'dan Olish

### 2.1. Loyiha Uchun Papka Yaratish

```bash
# Home papkasida loyihalar uchun joy yaratish
cd /home
sudo mkdir -p /home/apps
cd /home/apps
```

### 2.2. Git Clone Qilish

```bash
git clone https://github.com/optombazar4-ux/PaketShopAIBot.git
cd PaketShopAIBot
```

---

## 3. Backend va Frontend Paketlarini O'rnatish

### 3.1. Backend Dependencies

```bash
# Asosiy papkada
npm install
```

### 3.2. Frontend Build Qilish

```bash
# Client papkasiga kirish
cd client

# Client dependencies o'rnatish
npm install

# Production build yaratish (client/dist papkasi yaratiladi)
npm run build

# Asosiy papkaga qaytish
cd ..
```

---

## 4. Environment Variables (.env) Faylini Yaratish

Asosiy papkada (PaketShopAIBot) `.env` faylini yaratamiz:

```bash
nano .env
```

Quyidagi ma'lumotlarni kiriting:

```env
# Node.js muhit
NODE_ENV=production
PORT=5000

# PostgreSQL Database
DATABASE_URL=postgresql://paketshop_user:your_strong_password_here@localhost:5432/paketshop_bot

# Telegram Bot
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
WEB_APP_URL=https://bot.paketshop.uz

# WooCommerce API
WOOCOMMERCE_URL=https://paketshop.uz
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxxxx

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
```

**CTRL+O** → Enter → **CTRL+X** bilan saqlang.

### Environment Variables Tushuntirish:

- `DATABASE_URL` - PostgreSQL bog'lanish manzili (1.4-qadamda yaratgan parolingizni kiriting)
- `TELEGRAM_BOT_TOKEN` - @BotFather'dan olgan bot tokeningiz
- `WEB_APP_URL` - Sizning domen manzilingiz (`https://bot.paketshop.uz`)
- `WOOCOMMERCE_URL` - WooCommerce do'koningiz manzili
- `WOOCOMMERCE_CONSUMER_KEY` - WooCommerce API kaliti
- `WOOCOMMERCE_CONSUMER_SECRET` - WooCommerce API sirli kaliti
- `GEMINI_API_KEY` - Google AI Studio'dan olgan API kalitingiz

---

## 5. Database Migrationlarini Ishga Tushirish

```bash
# Drizzle ORM yordamida database jadvallarini yaratish
npm run db:push
```

Bu buyruq `users`, `cart_items`, va `conversation_history` jadvallarini yaratadi.

---

## 6. Production Build Qilish

```bash
npm run build
```

Bu buyruq:
- Frontend'ni build qiladi (client/dist)
- Backend'ni compile qiladi (dist/index.js)

---

## 7. PM2 Bilan Botni Ishga Tushirish

### 7.1. PM2 Ecosystem Faylini Yaratish (ixtiyoriy, lekin tavsiya etiladi)

```bash
nano ecosystem.config.js
```

Quyidagi kodni kiriting:

```javascript
module.exports = {
  apps: [{
    name: 'paketshop-bot',
    script: './dist/index.js',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

Saqlang: **CTRL+O** → Enter → **CTRL+X**

### 7.2. Loglar Uchun Papka Yaratish

```bash
mkdir -p logs
```

### 7.3. PM2 Bilan Ishga Tushirish

```bash
# Ecosystem fayli bilan ishga tushirish
pm2 start ecosystem.config.js

# Yoki to'g'ridan-to'g'ri:
pm2 start dist/index.js --name paketshop-bot

# PM2 proceslarini ko'rish
pm2 list

# Loglarni ko'rish
pm2 logs paketshop-bot

# PM2 monitoring
pm2 monit
```

### 7.4. PM2 ni Server Qayta Yoqilganda Avtomatik Ishga Tushirish

```bash
# PM2 startup scriptini yaratish
pm2 startup

# Joriy proceslarni saqlash
pm2 save
```

---

## 8. Nginx Konfiguratsiyasi

### 8.1. Nginx Config Faylini Yaratish

```bash
sudo nano /etc/nginx/sites-available/bot.paketshop.uz
```

Quyidagi konfiguratsiyani kiriting:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name bot.paketshop.uz;

    # Frontend static files (React build)
    root /home/apps/PaketShopAIBot/client/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;

    # Frontend routing (React Router / Wouter)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API reverse proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Prevent access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

Saqlang: **CTRL+O** → Enter → **CTRL+X**

### 8.2. Nginx Config'ni Faollashtirish

```bash
# Symbolic link yaratish
sudo ln -s /etc/nginx/sites-available/bot.paketshop.uz /etc/nginx/sites-enabled/

# Default nginx config'ni o'chirish (agar kerak bo'lsa)
sudo rm /etc/nginx/sites-enabled/default

# Nginx konfiguratsiyasini tekshirish
sudo nginx -t

# Nginx'ni qayta yuklash
sudo systemctl reload nginx
```

---

## 9. SSL (HTTPS) O'rnatish - Certbot

### 9.1. Certbot O'rnatish

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 9.2. SSL Sertifikatini Olish

**Muhim:** Domen `bot.paketshop.uz` serveringizning IP manziliga ko'rsatilgan bo'lishi kerak!

```bash
sudo certbot --nginx -d bot.paketshop.uz
```

Sizdan so'ralganida:
1. Email manzilingizni kiriting
2. Terms of Service'ga rozilk bering (Y)
3. Redirect to HTTPS'ni tanlang (2)

### 9.3. SSL Auto-Renewal Tekshirish

```bash
# SSL sertifikati avtomatik yangilanishini tekshirish
sudo certbot renew --dry-run
```

Agar hech qanday xato bo'lmasa, SSL sertifikatingiz har 90 kunda avtomatik yangilanadi.

---

## 10. Firewall Sozlash (ixtiyoriy, lekin tavsiya etiladi)

```bash
# UFW firewall'ni yoqish
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Status tekshirish
sudo ufw status
```

---

## 11. Yakuniy Tekshiruv

### 11.1. Backend Ishga Tushganligini Tekshirish

```bash
# PM2 status
pm2 list

# Loglarni ko'rish
pm2 logs paketshop-bot --lines 50
```

### 11.2. Brauzerda Ochish

1. Brauzerda `https://bot.paketshop.uz` ni oching
2. Frontend yuklanishi kerak
3. Telegram botingizda `/start` ni yuboring va "📱 Katalog" tugmasini bosing

### 11.3. API Endpointlarini Tekshirish

```bash
# Serverda curl bilan tekshirish
curl http://localhost:5000/api/products

# Yoki tashqaridan:
curl https://bot.paketshop.uz/api/products
```

---

## 12. Foydali PM2 Buyruqlar

```bash
# Procesni to'xtatish
pm2 stop paketshop-bot

# Procesni qayta ishga tushirish
pm2 restart paketshop-bot

# Procesni o'chirish
pm2 delete paketshop-bot

# Barcha proceslarni ko'rish
pm2 list

# Real-time loglar
pm2 logs paketshop-bot

# CPU va Memory monitoring
pm2 monit

# Process ma'lumotlarini ko'rish
pm2 show paketshop-bot
```

---

## 13. Kodni Yangilash (Git Pull & Redeploy)

Kelajakda kodni yangilaganingizda:

```bash
cd /home/apps/PaketShopAIBot

# Git pull
git pull origin main

# Dependencies'ni yangilash (agar package.json o'zgarga bo'lsa)
npm install

# Frontend'ni qayta build qilish
cd client
npm install  # agar yangi paketlar qo'shilgan bo'lsa
npm run build
cd ..

# Backend'ni qayta build qilish
npm run build

# Database migratsiyalarini ishga tushirish (agar schema o'zgarga bo'lsa)
npm run db:push

# PM2 procesni qayta ishga tushirish
pm2 restart paketshop-bot

# Loglarni kuzatish
pm2 logs paketshop-bot
```

---

## 14. Muammolarni Bartaraf Qilish (Troubleshooting)

### Backend ishlamayapti:
```bash
pm2 logs paketshop-bot
# Loglardan xatoni toping
```

### Database bog'lanmayapti:
```bash
# PostgreSQL ishga tushganligini tekshirish
sudo systemctl status postgresql

# Database bog'lanishini tekshirish
psql -U paketshop_user -d paketshop_bot -h localhost
```

### Nginx xatolar:
```bash
# Nginx loglarini ko'rish
sudo tail -f /var/log/nginx/error.log

# Nginx konfiguratsiyasini tekshirish
sudo nginx -t
```

### Port band bo'lsa:
```bash
# Port 5000 bandligini tekshirish
sudo lsof -i :5000

# Processni to'xtatish
sudo kill -9 <PID>
```

---

## 15. Xavfsizlik Tavsiyalar

1. **.env faylini himoyalang:**
   ```bash
   chmod 600 .env
   ```

2. **Root user o'rniga oddiy user yarating:**
   ```bash
   adduser paketshop
   usermod -aG sudo paketshop
   ```

3. **SSH parolsiz kirish (SSH keys) sozlang**

4. **Firewall'ni yoqing** (10-qadamda ko'rsatilgan)

5. **PostgreSQL faqat localhost'dan qabul qilsin:**
   ```bash
   sudo nano /etc/postgresql/14/main/pg_hba.conf
   # host all all 127.0.0.1/32 md5
   ```

---

## 16. Monitoring va Backup

### PM2 Monitoring:
```bash
pm2 plus  # PM2 Plus cloud monitoring
```

### Database Backup:
```bash
# Backup yaratish
pg_dump -U paketshop_user paketshop_bot > backup_$(date +%Y%m%d).sql

# Backup'dan tiklash
psql -U paketshop_user paketshop_bot < backup_20250104.sql
```

### Avtomatik Backup (Cron):
```bash
crontab -e

# Har kuni soat 02:00 da backup
0 2 * * * pg_dump -U paketshop_user paketshop_bot > /home/backups/db_$(date +\%Y\%m\%d).sql
```

---

## ✅ Deployment Checklist

- [ ] Node.js v20+ o'rnatildi
- [ ] PostgreSQL o'rnatildi va database yaratildi
- [ ] Git clone qilindi
- [ ] npm install (backend + frontend)
- [ ] Frontend build qilindi (client/dist)
- [ ] .env fayli to'g'ri sozlandi
- [ ] Database migration qilindi (npm run db:push)
- [ ] Production build yaratildi (npm run build)
- [ ] PM2 bilan bot ishga tushirildi
- [ ] Nginx konfiguratsiyasi sozlandi
- [ ] SSL sertifikati o'rnatildi (HTTPS)
- [ ] Firewall sozlandi
- [ ] Telegram botda test qilindi
- [ ] PM2 startup enabled (server restart'da avtomatik ishga tushishi)

---

## Yordam

Agar qiyinchiliklarga duch kelsangiz:

1. PM2 loglarini tekshiring: `pm2 logs paketshop-bot`
2. Nginx loglarini tekshiring: `sudo tail -f /var/log/nginx/error.log`
3. PostgreSQL loglarini tekshiring: `sudo tail -f /var/log/postgresql/postgresql-14-main.log`

Omad! 🚀
