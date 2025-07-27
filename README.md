# LCW Product Carousel

LCW ürün sayfalarında "İlgini Çekebilecek Diğer Ürünler" başlığı altında ürün önerileri sunan carousel bileşeni.

## Özellikler

- **Ürün Carousel'i**: LCW tasarımının birebir kopyası
- **API Entegrasyonu**: JSON endpoint'ten ürün verileri
- **Responsive Tasarım**: Mobil, tablet ve masaüstü uyumlu
- **Favori Sistemi**: Kalp ikonu ile favori ekleme/çıkarma
- **Local Storage**: Favori ürünlerin kalıcı saklanması
- **Cache Sistemi**: localStorage ile performans optimizasyonu

## Kullanım

```javascript
// Chrome Developer Tools Console'da çalıştırın
```

## API

```
GET https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json
```

## Teknik Detaylar

- **Teknoloji**: Vanilla JavaScript + jQuery
- **3rd Party**: Kütüphane kullanılmadı
- **Dosya**: Tek .js dosyası
- **Konum**: .product-detail elementinden sonra
- **Responsive**: Ekran boyutuna göre ürün sayısı değişir

## Gereksinimler

- Modern web tarayıcısı
- LCW ürün sayfası (.product-detail elementi)
- jQuery (otomatik yüklenir)
