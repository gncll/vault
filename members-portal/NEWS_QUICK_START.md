# AI News - Hızlı Başlangıç

## 🚀 3 Adımda News Ekleme

### 1. Görseli Hazırla
- **Boyut:** 1200x675px (16:9 oran)
- **Format:** JPG veya WebP
- **Dosya boyutu:** <200KB
- **İsim:** kebab-case (örn: `openai-gpt5-release.jpg`)

### 2. Görseli Yükle
```bash
# Görseli public/news/ klasörüne koy
cp your-image.jpg members-portal/public/news/

# Git'e ekle ve push et
git add public/news/your-image.jpg
git commit -m "Add news image: your-image"
git push
```

### 3. GitHub'da news.json Güncelle

1. GitHub repo'ya git: `https://github.com/YOUR-USERNAME/vault-content`
2. `news.json` dosyasını aç
3. Edit (kalem ikonu) tıkla
4. Yeni haberi array'in EN BAŞINA ekle:

```json
[
  {
    "id": "unique-news-slug",
    "title": "Ana haber başlığı",
    "subtitle": "PLUS: İkincil bilgi veya ek detay",
    "image": "/news/your-image.jpg",
    "date": "2025-12-06",
    "url": "https://external-link.com/full-article"
  },
  ... (diğer haberler)
]
```

5. "Commit changes" tıkla
6. **5 dakika bekle** → Site otomatik güncellenecek!

## 📋 news.json Format

```json
{
  "id": "string",          // Benzersiz slug (örn: "anthropic-claude-4")
  "title": "string",       // Ana başlık (max 80 karakter)
  "subtitle": "string",    // Alt başlık (max 100 karakter)
  "image": "/news/xxx.jpg", // Görsel path
  "date": "YYYY-MM-DD",    // ISO format tarih
  "url": "https://..."     // External link (yeni tab'da açılır)
}
```

## 🎨 Görsel İpuçları

### Optimize Etme:
1. [TinyPNG](https://tinypng.com/) ile sıkıştır
2. [Squoosh](https://squoosh.app/) ile WebP'ye çevir
3. 16:9 oran için [Canva](https://canva.com) kullan

### Örnek Boyutlar:
- **1200x675px** - Önerilen
- **1600x900px** - HD kalite
- **800x450px** - Minimum

## ✅ Workflow Özeti

```
1. Görsel hazırla (1200x675)
   ↓
2. public/news/ klasörüne koy
   ↓
3. Git push yap
   ↓
4. GitHub'da news.json güncelle
   ↓
5. 5 dakika bekle
   ↓
6. Site'de görünür! ✨
```

## 🔍 Test Etme

### Local Test:
```bash
npm run dev
# http://localhost:3002/news aç
```

### Live Test:
```
1. GitHub'da değişiklik yap
2. 5 dakika bekle
3. https://your-site.vercel.app/news aç
4. Hard refresh (Cmd + Shift + R)
```

## 📝 Örnek Haber

```json
{
  "id": "deepmind-alphafold-3",
  "title": "DeepMind unveils AlphaFold 3 with unprecedented accuracy",
  "subtitle": "PLUS: How AI is revolutionizing drug discovery",
  "image": "/news/alphafold-3.jpg",
  "date": "2025-12-06",
  "url": "https://deepmind.google/discover/blog/alphafold-3"
}
```

## 🎯 En İyi Pratikler

### Başlıklar:
- ✅ "OpenAI releases GPT-5 with reasoning capabilities"
- ❌ "YOU WON'T BELIEVE WHAT OPENAI DID!!!"

### Subtitles:
- ✅ "PLUS: Compare GPT-5 vs Claude Opus 4"
- ✅ "New features include vision and audio"
- ❌ Çok uzun açıklamalar (>100 karakter)

### ID'ler:
- ✅ "anthropic-claude-sonnet-4"
- ✅ "deepseek-v3-release"
- ❌ "news123" (açıklayıcı değil)
- ❌ "Anthropic Claude Sonnet 4!" (boşluk ve özel karakter)

### Tarihler:
- ✅ "2025-12-06"
- ❌ "06/12/2025"
- ❌ "December 6, 2025"

## 🚨 Sık Hatalar

### Görsel gözükmüyor:
- Path doğru mu? (`/news/` ile başlamalı)
- Dosya `public/news/` klasöründe mi?
- Git push yapıldı mı?

### Haber gözükmüyor:
- JSON formatı geçerli mi? ([JSONLint](https://jsonlint.com/) ile kontrol et)
- 5 dakika geçti mi? (cache refresh)
- ID benzersiz mi?

### Tarih sıralaması yanlış:
- ISO format kullan: `YYYY-MM-DD`
- En yeni haber en üstte olmalı (date'e göre otomatik sıralanır)

## 🔄 Güncelleme ve Silme

### Haberi Güncelle:
1. `news.json` aç
2. İlgili haberi bul
3. Değiştir (title, subtitle, url, vb.)
4. Commit → 5 dakika bekle

### Haberi Sil:
1. `news.json` aç
2. İlgili haber object'ini tamamen sil (virgül dikkat!)
3. Commit → 5 dakika bekle

### Görseli Değiştir:
1. Yeni görseli aynı isimle `public/news/` koy
2. Git push
3. Veya farklı isimle yükle + `news.json`'da path güncelle

## 🎓 İleri Seviye

### Cache'i Anında Temizle:
```bash
# Vercel Dashboard → Deployments → Redeploy
# veya
git commit --allow-empty -m "Force rebuild"
git push
```

### Toplu Haber Ekle:
```json
[
  { "id": "news-1", ... },
  { "id": "news-2", ... },
  { "id": "news-3", ... }
]
```
En yeni tarih en üstte olsun.

### RSS Feed (Gelecek):
news.json otomatik olarak RSS feed'e çevrilebilir (planlanan özellik)

## 📞 Destek

Sorun mu yaşıyorsun?
1. JSON'u [JSONLint](https://jsonlint.com/)'te kontrol et
2. Browser console'da hata var mı kontrol et (F12)
3. `NEWS_README.md` dosyasını oku (detaylı dökümantasyon)

## 🎉 Tamamdır!

Artık AI haberleri 3 adımda ekleyebilirsin. Kolay gelsin! 🚀
