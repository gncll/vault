# GitHub Content Management Sistemi

## Nasıl Çalışıyor?

Site içeriklerini (Custom GPTs, Projects, Prompts) GitHub'dan çekiyor. Sen GitHub'da dosyaları güncellediğinde, site otomatik olarak yeni içeriği gösterir.

## 1. GitHub Repository Kurulumu

### A. Yeni Public Repo Oluştur

1. GitHub'a git: https://github.com/new
2. Repository name: `vault-content` (veya istediğin isim)
3. **Public** seç (ücretsiz)
4. Create repository

### B. İçerik Dosyalarını Ekle

Repository'ye şu 4 dosyayı ekle:

#### `customgpts.json`
```json
[
  {
    "id": 1,
    "name": "Data Analysis Expert",
    "description": "Analyze datasets and create visualizations",
    "link": "https://chat.openai.com/g/g-YOUR-GPT-ID",
    "category": "Data Science"
  },
  {
    "id": 2,
    "name": "Code Review Assistant",
    "description": "Review code for best practices",
    "link": "https://chat.openai.com/g/g-ANOTHER-GPT-ID",
    "category": "Development"
  }
]
```

#### `projects.json`
```json
[
  {
    "id": 1,
    "title": "AI-Powered Web Scraper",
    "description": "Build an intelligent web scraper using Python and AI",
    "pdfUrl": "/pdfs/web-scraper-project.pdf",
    "category": "Web Development",
    "difficulty": "Intermediate"
  },
  {
    "id": 2,
    "title": "Sentiment Analysis Dashboard",
    "description": "Create a real-time sentiment analysis dashboard",
    "pdfUrl": "/pdfs/sentiment-analysis.pdf",
    "category": "Data Science",
    "difficulty": "Advanced"
  }
]
```

#### `prompts.json`
```json
[
  {
    "id": 1,
    "title": "Data Analysis Expert",
    "category": "Data Science",
    "description": "Analyze datasets and provide insights",
    "prompt": "You are a data analysis expert. When given a dataset:\n\n1. Analyze the data structure\n2. Suggest visualizations\n3. Provide insights\n4. Explain findings clearly\n\nAlways ask clarifying questions if needed.",
    "tags": ["Data", "Analysis", "Statistics"]
  }
]
```

#### `news.json`
```json
[
  {
    "id": "anthropic-claude-sonnet-5",
    "title": "Anthropic puts Claude in the interviewer's chair",
    "subtitle": "PLUS: How to One-Shot a Landing Page with Replit Design Mode",
    "image": "/news/claude-interviewer.jpg",
    "date": "2025-12-06",
    "url": "https://therundown.ai/p/anthropic-claude-sonnet-5"
  },
  {
    "id": "openai-ipo-showdown",
    "title": "Anthropic and OpenAI's IPO showdown",
    "subtitle": "PLUS: Get instant business insights from spreadsheets",
    "image": "/news/ipo-race.jpg",
    "date": "2025-12-05",
    "url": "https://therundown.ai/p/ipo-showdown"
  }
]
```

## 2. Site Konfigürasyonu

### `.env.local` dosyana ekle:

```bash
# GitHub Content Settings
NEXT_PUBLIC_GITHUB_OWNER=senin-github-username
NEXT_PUBLIC_GITHUB_REPO=vault-content
NEXT_PUBLIC_GITHUB_BRANCH=main
```

**Örnek:**
```bash
NEXT_PUBLIC_GITHUB_OWNER=gencay
NEXT_PUBLIC_GITHUB_REPO=vault-content
NEXT_PUBLIC_GITHUB_BRANCH=main
```

## 3. News İmages Klasörü Oluştur

News görselleri için local'de `public/news/` klasörü oluştur:

```bash
mkdir -p public/news
```

Görseller:
- **Format:** WebP veya JPEG
- **Boyut:** 1200x675px (16:9 oran)
- **Dosya boyutu:** <200KB
- **İsimlendirme:** kebab-case (örn: `claude-interviewer.jpg`)

## 4. İçerik Ekleme/Güncelleme

### News Eklemek:

1. Görseli hazırla (1200x675px, 16:9)
2. Görseli `public/news/` klasörüne koy
3. GitHub'da `news.json` aç
4. Yeni haberi ekle:

```json
{
  "id": "unique-slug-identifier",  // Benzersiz, URL-friendly ID
  "title": "Ana başlık buraya",
  "subtitle": "PLUS: İkincil açıklama buraya",
  "image": "/news/gorsel-adi.jpg",  // public/news/ içindeki dosya
  "date": "2025-12-06",  // ISO format (YYYY-MM-DD)
  "url": "https://external-link.com/article"  // Haber linki
}
```

5. Görselleri Vercel'e deploy et: `git add public/news/ && git push`
6. 5 dakika bekle → Haberler görünür!

### Custom GPT Eklemek:

1. GitHub'da `customgpts.json` dosyasını aç
2. Click "Edit" (kalem ikonu)
3. Yeni GPT'yi array'e ekle:

```json
{
  "id": 3,  // Sıradaki numara
  "name": "Yeni GPT Adı",
  "description": "Ne işe yarar",
  "link": "https://chat.openai.com/g/g-GPT-ID",
  "category": "Data Science"  // veya Development, Documentation, AI/ML, Marketing
}
```

4. Commit changes
5. **5 dakika bekle** → Site otomatik güncellenecek!

### Project (PDF) Eklemek:

1. PDF'i siteye yükle: `public/pdfs/yeni-proje.pdf`
2. Vercel'e deploy et (`git push`)
3. GitHub'da `projects.json` güncelle:

```json
{
  "id": 3,
  "title": "Yeni Proje Başlığı",
  "description": "Proje açıklaması",
  "pdfUrl": "/pdfs/yeni-proje.pdf",  // PDF dosya adı
  "category": "Web Development",  // veya Data Science, AI/ML, DevOps
  "difficulty": "Intermediate"  // Beginner, Intermediate, Advanced
}
```

### Prompt Eklemek:

1. GitHub'da `prompts.json` aç
2. Yeni prompt ekle:

```json
{
  "id": 4,
  "title": "Prompt Başlığı",
  "category": "Development",  // Data Science, Development, Documentation, Marketing, Content
  "description": "Kısa açıklama",
  "prompt": "Buraya uzun prompt metnini yaz.\n\nÇok satırlı olabilir.\n\n1. Liste\n2. Yapabilirsin",
  "tags": ["Tag1", "Tag2", "Tag3"]
}
```

## 4. Cache ve Güncelleme

- **Otomatik Güncelleme:** Her 5 dakikada bir yeni içerik kontrol edilir
- **Manuel Güncelleme:** Vercel dashboard'dan "Redeploy" yap
- **Anında Test:** Local'de `npm run dev` ile test et

## 5. Private Repository (Opsiyonel)

Eğer içerikleri private tutmak istersen:

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Seç: `repo` (Full control of private repositories)
4. Copy token
5. `.env.local` ekle:

```bash
GITHUB_TOKEN=ghp_XXXXXXXXXXXXXXXXXXXX
```

**ÖNEMLİ:** Bu token'ı asla public yapma! Sadece local ve Vercel environment variables'da.

## 6. Vercel'de Environment Variables Ayarla

1. Vercel Dashboard → Project → Settings → Environment Variables
2. Ekle:
   - `NEXT_PUBLIC_GITHUB_OWNER` = `senin-username`
   - `NEXT_PUBLIC_GITHUB_REPO` = `vault-content`
   - `NEXT_PUBLIC_GITHUB_BRANCH` = `main`
   - `GITHUB_TOKEN` = `ghp_...` (sadece private repo ise)

3. Redeploy project

## 7. Workflow Özeti

### Yeni İçerik Eklemek:

```
1. GitHub'da ilgili JSON dosyasını aç (customgpts.json, projects.json, prompts.json)
2. Edit → Yeni içerik ekle → Commit
3. 5 dakika bekle → Site otomatik güncellenir!
```

### PDF Proje Eklemek:

```
1. PDF'i local'de `public/pdfs/` klasörüne koy
2. git add . && git commit -m "Add new project PDF"
3. git push
4. GitHub'da projects.json güncelle
5. Done!
```

### Test Etmek:

```bash
# Local'de test et
npm run dev
# http://localhost:3001 aç

# Live test et
# GitHub'da değişiklik yap → 5 dakika bekle → site'yi aç
```

## 8. Master Email İle Test

1. Stripe'da kendi email'ine active subscription ekle
2. Site'de bu email ile Sign In yap
3. Tüm içeriklere erişirsin
4. Yeni eklediğin içerikleri kontrol et

## 9. Kategoriler

### Custom GPTs:
- Data Science
- Development
- Documentation
- AI/ML
- Marketing

### Projects:
- Web Development
- Data Science
- AI/ML
- DevOps

### Prompts:
- Data Science
- Development
- Documentation
- Marketing
- Content

## 10. Örnek GitHub Repo Yapısı

```
vault-content/
├── customgpts.json
├── projects.json
├── prompts.json
├── news.json
└── README.md (opsiyonel açıklama)
```

**Local project structure:**
```
members-portal/
└── public/
    ├── pdfs/          # Project PDF files
    ├── news/          # News images (1200x675px)
    └── logo.png
```

## 11. Troubleshooting

### İçerikler gözükmüyor:
- GitHub repo public mi kontrol et
- `.env.local` doğru mu kontrol et
- Vercel environment variables doğru mu kontrol et
- JSON formatı doğru mu kontrol et (https://jsonlint.com/)
- 5 dakika bekle (cache refresh)

### JSON hataları:
- Her object virgülle ayrılmalı (son hariç)
- Çift tırnak kullan (`"` tek tırnak değil `'`)
- ID'ler unique olmalı
- Backtick kullanma JSON'da

### PDF gözükmüyor:
- PDF dosyası `public/pdfs/` klasöründe mi?
- `pdfUrl` path doğru mu? (`/pdfs/dosya-adi.pdf`)
- Vercel'e deploy edildi mi? (`git push`)

## 12. Tips

- GitHub'da edit yaparken "Preview" tab'inde JSON formatını kontrol et
- ID'leri sırayla ver (1, 2, 3...)
- PDF dosya adlarında türkçe karakter kullanma
- Kategorileri tutarlı kullan (büyük/küçük harf dikkat)
- Uzun prompt'larda `\n\n` ile paragraf ayır

## 13. Vercel Deploy Sıklığı

Eğer daha hızlı güncelleme istersen, `lib/github.ts` dosyasında:

```typescript
next: { revalidate: 60 }  // 60 saniyede bir
// veya
next: { revalidate: 300 }  // 5 dakikada bir (default)
```

Done! Artık GitHub üzerinden tüm içeriklerini yönetebilirsin. 🚀
