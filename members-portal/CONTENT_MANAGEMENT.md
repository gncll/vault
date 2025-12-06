# İçerik Yönetim Rehberi

## Master Email Ayarı

### Stripe'da Master Email Ekle:
1. Stripe → Customers → Create Customer
2. Email: **gencay@yourdomain.com** (kendi email'in)
3. Subscriptions → Add Subscription → Active bir subscription ekle
4. Bu email ile giriş yaptığında her şeye erişirsin!

## İçerik Ekleme

### 1. Custom GPTs Eklemek

**Dosya:** `app/customgpts/page.tsx`

```typescript
const customGPTs = [
  {
    id: 1,
    name: 'GPT Adı',
    description: 'GPT açıklaması',
    link: 'https://chat.openai.com/g/gpt-id-buraya',
    category: 'Kategori'  // Data Science, Development, Documentation, vs.
  },
  // Yeni GPT ekle:
  {
    id: 2,
    name: 'Yeni GPT',
    description: 'Ne işe yarar',
    link: 'https://chat.openai.com/g/...',
    category: 'AI/ML'
  }
]
```

### 2. Projects (PDF) Eklemek

**Adım 1:** PDF'i koy: `public/pdfs/proje-adi.pdf`

**Adım 2:** `app/projects/page.tsx` güncelle:

```typescript
const projects = [
  {
    id: 1,
    title: 'Proje Başlığı',
    description: 'Proje açıklaması',
    pdfUrl: '/pdfs/proje-adi.pdf',  // Dosya adı buraya
    category: 'Web Development',  // veya Data Science, AI/ML
    difficulty: 'Intermediate'  // Beginner, Intermediate, Advanced
  },
  // Yeni proje ekle...
]
```

**Adım 3:** `app/projects/[id]/page.tsx` güncelle:

```typescript
const projects: { [key: string]: { title: string; pdfUrl: string } } = {
  '1': {
    title: 'İlk Proje',
    pdfUrl: '/pdfs/proje-1.pdf'
  },
  '2': {  // Yeni proje
    title: 'İkinci Proje',
    pdfUrl: '/pdfs/proje-2.pdf'
  }
}
```

### 3. Prompts Eklemek

**Dosya:** `app/prompts/page.tsx`

```typescript
const prompts = [
  {
    id: 1,
    title: 'Prompt Başlığı',
    category: 'Data Science',  // Development, Marketing, Documentation
    description: 'Kısa açıklama',
    prompt: `Buraya prompt metnini yaz.

Çok satırlı olabilir.

1. Liste yapabilirsin
2. İkinci madde`,
    tags: ['Tag1', 'Tag2', 'Tag3']
  },
  // Yeni prompt ekle...
]
```

## Değişiklikleri Yayınlama

### Local'de test:
```bash
npm run dev
# http://localhost:3001 aç ve kontrol et
```

### Vercel'e deploy:
```bash
git add .
git commit -m "Add new content"
git push
# Vercel otomatik deploy eder
```

## Master Email ile Test

1. Stripe'da kendi email'ine active subscription ekle
2. Site'de bu email ile Sign In yap
3. Tüm içeriklere erişebilirsin
4. Yeni eklediğin içerikleri test et
5. Sorun yoksa live'a deploy et

## Kategoriler

**Custom GPTs:** Data Science, Development, Documentation, AI/ML, Marketing
**Projects:** Web Development, Data Science, AI/ML, DevOps
**Prompts:** Data Science, Development, Documentation, Marketing, Content

## Tips

- ID'leri sırayla ver (1, 2, 3...)
- PDF dosya adlarında türkçe karakter kullanma
- Prompt'larda backtick (\`) kullanırsan escape et: \\\`
- Category'leri tutarlı kullan (büyük/küçük harf dikkat)

## Örnek Workflow

1. Yeni GPT yaptın → `customgpts/page.tsx` aç → array'e ekle → kaydet
2. Yeni PDF'in var → `public/pdfs/` koy → `projects/page.tsx` güncelle
3. Yeni prompt → `prompts/page.tsx` aç → array'e ekle
4. Test et → `npm run dev`
5. Deploy et → `git push`

Done! ✅
