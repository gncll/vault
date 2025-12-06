# Quick Start Guide

## Hızlı Başlangıç (5 Dakika)

### 1. Environment Variables Ayarla

`.env.local` dosyasını düzenleyin:

```bash
# Clerk (clerk.com'dan alın)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Stripe (stripe.com'dan alın)
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
NEXT_PUBLIC_PREMIUM_PRICE_ID=price_xxxxx
```

### 2. Development Server'ı Başlat

```bash
npm run dev
```

Tarayıcıda açın: http://localhost:3000

### 3. İçerikleri Ekle

#### Custom GPTs Ekle
`app/customgpts/page.tsx` içindeki `customGPTs` dizisini güncelleyin

#### PDF Projeleri Ekle
1. PDF'leri `public/pdfs/` klasörüne koyun
2. `app/projects/page.tsx` içindeki `projects` dizisini güncelleyin

#### Prompts Ekle
`app/prompts/page.tsx` içindeki `prompts` dizisini güncelleyin

### 4. Vercel'e Deploy Et

```bash
# GitHub'a push et
git add .
git commit -m "Initial setup"
git push

# Vercel'de:
# - Repository'i import et
# - Environment variables ekle
# - Deploy!
```

## Test Nasıl Yapılır?

### Local Test:
1. Clerk'te test hesabı oluşturun
2. Stripe'ta test customer oluşturun
3. Test subscription ekleyin
4. Premium içeriklere erişimi test edin

### Production'da:
1. Gerçek Clerk ve Stripe keys kullanın
2. Substack'i Stripe ile bağlayın
3. Üyeler otomatik olarak Stripe'da customer olacak

## Sorun Giderme

**Build hatası?**
- `.env.local` dosyasındaki tüm değişkenlerin dolu olduğundan emin olun

**Authentication çalışmıyor?**
- Clerk keys'lerin doğru olduğundan emin olun
- Browser cache'i temizleyin

**Subscription check çalışmıyor?**
- Email'in Stripe'da customer olarak var olduğunu kontrol edin
- Active subscription olduğundan emin olun

## Sonraki Adımlar

1. README.md dosyasını okuyun (detaylı bilgi için)
2. SETUP_GUIDE.md'yi okuyun (adım adım kurulum için)
3. İçeriklerinizi ekleyin
4. Deploy edin!

Başarılar! 🚀
