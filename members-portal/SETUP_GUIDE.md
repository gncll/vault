# Setup Guide - LearnAI Members Portal

Bu rehber adım adım projeyi nasıl kuracağınızı ve Vercel'e nasıl deploy edeceğinizi gösterir.

## 1. Clerk Hesabı Oluşturma

### Adımlar:
1. [clerk.com](https://clerk.com) adresine gidin
2. "Sign Up" butonuna tıklayın
3. Email ile hesap oluşturun
4. Email'inizi onaylayın

### Yeni Uygulama Oluşturma:
1. Dashboard'da "Create Application" butonuna tıklayın
2. Uygulama adını girin (örn: "LearnAI Members")
3. Sign-in seçeneklerini seçin (Email + Google önerilir)
4. "Create Application" tıklayın

### API Keys'leri Alma:
1. Dashboard'da sol menüden "API Keys" tıklayın
2. Şu bilgileri kopyalayın:
   - **Publishable key** (pk_test ile başlar)
   - **Secret key** (sk_test ile başlar)
3. Bu bilgileri `.env.local` dosyanıza ekleyin

## 2. Stripe Hesabı Oluşturma

### Adımlar:
1. [stripe.com](https://stripe.com) adresine gidin
2. "Start now" butonuna tıklayın
3. Hesap oluşturun

### Test Modunda Çalışma:
1. Dashboard'da sağ üstten "Test mode" açık olduğundan emin olun
2. Menüden "Developers" > "API keys" seçin
3. Şu bilgileri kopyalayın:
   - **Publishable key** (pk_test ile başlar)
   - **Secret key** (sk_test ile başlar)

### Subscription Product Oluşturma:
1. Dashboard'da "Products" > "Add Product" tıklayın
2. Product bilgilerini girin:
   - Name: "Premium Membership"
   - Description: "LearnAI Premium Content Access"
3. Pricing bilgilerini girin:
   - Model: Recurring
   - Price: Aylık fiyatınız (örn: $10)
   - Billing period: Monthly
4. "Save product" tıklayın
5. Price ID'yi kopyalayın (price_ ile başlar)

### Substack ile Entegrasyon:
Stripe'ı Substack ile bağlamak için:
1. Substack Settings > Payments kısmına gidin
2. Stripe hesabınızı bağlayın
3. Substack otomatik olarak yeni üyeler için Stripe'da customer oluşturacak

## 3. Environment Variables Ayarlama

`.env.local` dosyasını düzenleyin:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_PREMIUM_PRICE_ID=price_...
```

## 4. İçerikleri Ekleme

### Custom GPTs Ekleme:
`app/customgpts/page.tsx` dosyasını açın:

```typescript
const customGPTs = [
  {
    id: 1,
    name: 'Sizin GPT Adınız',
    description: 'GPT açıklaması',
    link: 'https://chat.openai.com/g/your-gpt-id',
    category: 'Kategori',
    icon: '🤖'
  },
  // Daha fazla GPT ekleyin...
]
```

### PDF Projeleri Ekleme:
1. PDF dosyalarınızı `public/pdfs/` klasörüne koyun
2. `app/projects/page.tsx` dosyasını açın:

```typescript
const projects = [
  {
    id: 1,
    title: 'Proje Adı',
    description: 'Proje açıklaması',
    pdfUrl: '/pdfs/your-file.pdf',
    category: 'Kategori',
    difficulty: 'Beginner', // Beginner, Intermediate, Advanced
    icon: '📁'
  },
]
```

### Prompts Ekleme:
`app/prompts/page.tsx` dosyasını açın:

```typescript
const prompts = [
  {
    id: 1,
    title: 'Prompt Başlığı',
    category: 'Kategori',
    description: 'Kısa açıklama',
    prompt: `Buraya prompt metnini yazın...`,
    tags: ['Tag1', 'Tag2', 'Tag3']
  },
]
```

## 5. Local'de Test Etme

```bash
# Development server'ı başlatın
npm run dev

# Tarayıcıda açın
# http://localhost:3000
```

Test senaryoları:
1. Ana sayfanın açıldığını kontrol edin
2. Sign In butonuna tıklayın
3. Clerk ile giriş yapın
4. Dashboard'a yönlendirildiğinizi kontrol edin
5. Her sayfayı test edin (CustomGPTs, Projects, Prompts)

## 6. GitHub'a Push Etme

```bash
# Git repository oluşturun
git init
git add .
git commit -m "Initial commit"

# GitHub'da yeni repository oluşturun
# Sonra:
git remote add origin https://github.com/kullaniciadi/repo-adi.git
git branch -M main
git push -u origin main
```

## 7. Vercel'e Deploy Etme

### Adımlar:
1. [vercel.com](https://vercel.com) adresine gidin
2. GitHub ile giriş yapın
3. "Add New" > "Project" tıklayın
4. GitHub repository'nizi seçin
5. "Import" tıklayın

### Environment Variables Ekleme:
1. "Environment Variables" bölümüne gidin
2. Her bir variable'ı tek tek ekleyin:
   - Name: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Value: `pk_test_...`
3. Tüm environment variables'ları ekleyin
4. "Deploy" tıklayın

### Deploy Edilen Environment Variables:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_PREMIUM_PRICE_ID
```

### Production'a Geçiş:
Test modunda her şey çalışıyorsa:
1. Stripe dashboard'da "Activate account" yapın
2. Production API keys'leri alın
3. Vercel environment variables'ları production keys ile güncelleyin
4. Clerk'te production settings'i yapın

## 8. Domain Ayarlama (Opsiyonel)

### Vercel Domain:
1. Vercel project settings'e gidin
2. "Domains" sekmesine tıklayın
3. Custom domain ekleyin
4. DNS ayarlarını yapın (Vercel size gösterecek)

### Clerk Domain Ayarları:
1. Clerk dashboard'da "Domains" sekmesine gidin
2. Production domain'inizi ekleyin
3. Verify edin

## Troubleshooting

### Clerk Authentication Çalışmıyor:
- Environment variables'ları kontrol edin
- Browser cache'i temizleyin
- Clerk dashboard'da allowed domains kontrol edin

### Stripe Subscription Check Çalışmıyor:
- Email adresinin Stripe'da customer olarak kayıtlı olduğundan emin olun
- Stripe dashboard'da customer'ın active subscription'ı olduğunu kontrol edin
- Test mode'da olduğunuzdan emin olun

### PDF Görünmüyor:
- PDF dosyasının `public/pdfs/` klasöründe olduğundan emin olun
- Dosya adının kodda yazdığınız ile aynı olduğunu kontrol edin
- Browser console'da hata mesajlarını kontrol edin

## Destek

Sorun yaşıyorsanız:
1. README.md dosyasını okuyun
2. Browser console'da hataları kontrol edin
3. Vercel logs'larını kontrol edin (Dashboard > Deployments > View Function Logs)

## Başarılı Deploy Checklist

- [ ] Clerk authentication çalışıyor
- [ ] Stripe subscription check çalışıyor
- [ ] Ana sayfa düzgün görünüyor
- [ ] Dashboard'a erişilebiliyor
- [ ] CustomGPTs linkleri açılıyor
- [ ] PDF viewer çalışıyor
- [ ] Prompts sayfası çalışıyor
- [ ] Free user'lar paywall görüyor
- [ ] Premium user'lar içeriğe erişebiliyor
- [ ] Mobile responsive çalışıyor

Tebrikler! Siteniz artık canlıda! 🎉
