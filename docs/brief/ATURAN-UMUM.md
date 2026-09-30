# Aturan umum aset Numeria Arena

Salinan mandiri untuk repo `sayazia/orimathassets` (30 Sep 2026). Simpan di repo aset sebagai `docs/brief/ATURAN-UMUM.md`, bersama `BRIEF-UI-U1.md` dan `BRIEF-AUDIO.md`. Menggantikan rujukan ke "brief utama bagian 2, 4, 8, 9". Nama produk: **Numeria Arena** (dulu Foldlings; makhluk origami masih bernama `foldling_*` di nama berkas).

## 1. Arah seni

### 1.1 Bahasa bentuk (model 3D)
1. Origami sungguhan, bukan low-poly biasa: bidang datar, lipatan tajam, sudut runcing, tepi kertas tipis.
2. Siluet dulu: setiap makhluk dan objek dikenali dari siluetnya pada ukuran 6 cm dari jarak 50 cm.
3. Tebal kertas terlihat pada tepi yang menghadap pemain: 1.5 sampai 3 mm (skala dunia). Tidak ada bagian lebih tipis dari 2 mm atau lebih kecil dari 4 mm di sisi mana pun.
4. Dua nada per bidang lipat: sisi terang dan sisi bayangan dari satu warna palet (varian `_shade`).
5. Detail secukupnya: mata titik tinta, tanpa mulut kecuali ekspresi khusus. Tidak ada tekstur, gradien, atau pola cetak pada model.
6. Ramah anak, hangat, sedikit lucu. Tidak menyeramkan.
7. Terbaca di atas passthrough: warna jenuh sedang, hindari bidang putih murni besar dan hitam murni.
8. Satu keluarga visual: palet, proporsi lipatan, dan tebal alas yang sama.

### 1.2 Larangan (aturan kompetisi, mutlak)
- **Model 3D** tidak memuat teks, angka, huruf, logo, atau papan nama. Angka dan label pada model selalu digambar oleh game lewat anchor.
- **Aset UI 2D batch U1 memang berisi kata**, tetapi hanya dengan huruf kertas buatan sendiri dari bentuk (bukan font pihak ketiga). Tidak ada merek atau nama pihak lain di teks mana pun.
- Tidak ada karakter yang mirip karakter bermerek. Foldling adalah hewan origami yang membawa bendera kecil, bukan balok atau angka bermuka.
- Tidak ada orang nyata atau wajah realistis. Robot jelas robot dan fiktif.
- Tidak ada aset, font, gambar, atau suara pihak ketiga, kecuali sampel audio CC0 sesuai `BRIEF-AUDIO.md` yang dicatat sumbernya.

### 1.3 Standar layak publik
Selesai hanya bila: siluet jelas, lipatan terbaca, proporsi konsisten, tidak ada celah atau permukaan terbalik yang terlihat, pivot dan anchor benar, dan pratinjau skala meja terlihat seperti mainan kertas buatan tangan yang rapi. Bila ragu antara lebih detail atau lebih rapi, pilih lebih rapi.

## 2. Palet

Palet repo aset (`scripts/lib/palette.mjs`) adalah sumber tunggal, dengan peran (`ROLES`):

| Peran | Warna palet | Hex di game saat ini |
|---|---|---|
| `paper` (latar kertas, halaman buku) | `paper` | `#FFF8EC` |
| `paper_back` (sisi belakang kertas) | `cream` | `#F6E3C0` |
| `ink` (mata, garis, detail) | `dark` | `#3A3F4B` |
| misi `place_value` | `coral` | `#F2716B` |
| misi `multiply_divide` | `blue` | `#3469C4` |
| misi `fractions` | `teal` | `#3FB6A0` |
| misi `decimals` | `sunflower` | `#F9C74F` |
| misi `measurement` | `purple` | `#B198EA` |
| benar | `leaf` | `#5DB85B` |
| coba lagi (bukan merah menakutkan) | `orange` | `#F8961E` |
| emas hadiah | `gold` | `#E8B64C` |

Setiap warna punya varian `<nama>_shade` (sekitar 12 sampai 15% lebih gelap, rona sedikit lebih hangat). Kelima warna misi harus bisa dibedakan penderita buta warna (deuteranopia dan protanopia). Warna tambahan khusus UI ada di `BRIEF-UI-U1.md` bagian 1.2.

## 3. Legal dan asal-usul (wajib)

1. `LICENSE` di akar repo: CC0 1.0 untuk model, gambar, dan audio buatan sendiri; MIT untuk skrip generator. Pemilik hak cipta ditulis jelas.
2. Akun `sayazia` dan akun game `eziedutech` sama-sama milik Zia. README menyebut aset ini dibuat oleh pemilik yang sama untuk Numeria Arena.
3. Tidak ada materi pihak ketiga (font, gambar, model, warna merek, suara), kecuali sampel audio CC0 yang dicatat di manifest dan `LICENSE-THIRD-PARTY.md`.
4. Semua dibuat mulai 29 Sep 2026; riwayat git menjadi bukti.
5. README mencatat bahwa aset dibangun dari kode dengan bantuan Code Assistant, tanpa nama merek alat.

## 4. Checklist penerimaan

### 4.1 Model 3D (per batch)
- Dibangun dari `scripts/` dan bisa dibangun ulang.
- glTF validator: 0 error, 0 warning.
- `models/manifest.json` lengkap: `unit`, `triangles`, `bounds`, `anchors`, `parts`, `variants`, `clips`, `materials`.
- Tidak ada teks, angka, logo, atau merek di geometri.
- Nama node dan anchor persis seperti brief; pivot di sendi; tidak ada skala negatif.
- Pratinjau tiga sudut dan siluet hitam per aset, lembar kontak per grup, pratinjau skala meja (kamera sekitar 45 cm di atas meja, 45 cm di depan), strip klip untuk makhluk.
- Varian warna misi lolos simulasi buta warna.
- Ringkasan batch di `docs/CATALOG.md`: status, segitiga, dan keputusan yang berbeda beserta alasannya.

### 4.2 UI 2D dan audio
Checklist masing-masing ada di `BRIEF-UI-U1.md` bagian 5 dan `BRIEF-AUDIO.md` bagian 5.
