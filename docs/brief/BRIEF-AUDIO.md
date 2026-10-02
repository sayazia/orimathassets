# Brief Audio A1: efek suara dan musik Numeria Arena

Untuk agen aset di repo `sayazia/orimathassets` (30 Sep 2026, permintaan Zia). Aturan umum (legal, lisensi) ada di `docs/brief/ATURAN-UMUM.md` di repo aset. Nama produk kini **Numeria Arena**; makhluk origami hanya disebut Foldlings di nama berkas internal.

**Batas tugas (2 Okt 2026, wajib dibaca):** batch A1 **hanya bunyi**. Banyak aset visual game ini tidak dibuat di repo aset, melainkan langsung di repo game: model hewan kertas (dibuat Zia sendiri), kristal gugus, balon lembar lensa, orb, bintang, lencana, tangan kertas petunjuk, kartu kertas (gaya K), stiker kota dan papan peringkat, barisan hewan di belakang buku. Jangan membuat, mengganti, atau "memperbaiki" aset visual apa pun dalam batch ini, dan jangan menganggap katalog repo aset sebagai daftar lengkap aset game.

**Perubahan sejak brief pertama (2 Okt):** portal sudah tidak ada. Hewan keluar dari barisan hewan kertas di belakang buku, maju ke buku, dan setelah jawaban benar bersorak lalu terbang ke papan skor (skor naik saat ia tiba). Daftar bunyi di bagian 3 sudah disesuaikan.

## Prompt (tempel)

```
Kerjakan batch audio A1 untuk game Numeria Arena (game matematika mixed reality kelas 4 sampai 6,
dunia buku pop-up dan makhluk origami kertas). Buat semua bunyi di daftar di bawah.

Cara membuat, berurutan menurut prioritas:
1. Disintesis dari kode di scripts/audio/ (Python atau Node; boleh numpy/scipy), supaya bisa
   dibangun ulang, asli milik repo ini, dan riwayat git menjadi bukti. Ini jalur utama.
2. Hanya bila bunyi kertas nyata tidak bisa disintesis dengan layak: sampel CC0 (paket audio
   Kenney, atau Freesound dengan filter CC0 saja), diolah ulang di skrip. Catat URL, pembuat, dan
   lisensi di manifest. Jangan CC-BY, jangan lisensi lain, jangan musik atau suara orang yang dikenal.
Tidak boleh ada materi merek, melodi berhak cipta, atau suara manusia nyata.

Ikuti spesifikasi teknis, daftar bunyi, manifest, dan checklist di brief ini. Di akhir sesi
tulis ringkasan: berkas, durasi, ukuran, loudness, sumber, dan keputusan yang berbeda beserta alasannya.
```

## 1. Karakter

- Dunia kertas dan kayu: gemerisik, lipatan, "pop" kertas, ketukan balok kayu, lonceng dan marimba lembut.
- Benar terdengar hangat dan naik (dua sampai tiga nada marimba). Salah terdengar lucu dan lembut ("boing" kertas atau nada kayu rendah), **bukan buzzer**, karena pemainnya anak 9 sampai 12 tahun.
- Robot boleh sedikit "digital" (blip lembut), tetap tidak kasar.
- Tidak ada bunyi mengagetkan. Semua bunyi yang berulang sering (pop, ketukan) punya 2 sampai 3 varian agar tidak membosankan.

## 2. Spesifikasi teknis

| Hal | Spesifikasi |
|---|---|
| Format | OGG Vorbis (browser Quest berbasis Chromium). Tambahan WAV sumber boleh di `sources/`, tidak dimuat game |
| Sample rate | 48 kHz |
| Kanal | Mono untuk semua efek (game memposisikannya di ruang 3D); stereo hanya musik |
| Level | Puncak maks -1 dBFS. Efek sekitar -18 LUFS, musik sekitar -23 LUFS (game mengatur volume akhir) |
| Awal dan akhir | Tanpa hening di depan (bunyi mulai < 5 ms), ekor dipotong halus, tanpa klik |
| Ukuran | Efek maks 30 KB per berkas, musik maks 600 KB per trek, total batch maks 2.5 MB |
| Loop musik | Titik loop mulus (tanpa klik, tempo dan fase pas), panjang 30 sampai 60 detik |
| Lokasi | `sounds/<kategori>/<nama>.ogg`, kategori: `ui`, `book`, `creature`, `balloon`, `orb`, `answer`, `race`, `reward`, `music` |

## 3. Daftar bunyi

| Nama berkas | Kapan dimainkan | Durasi | Varian |
|---|---|---|---|
| `ui/envelope_open` | Tutup amplop menu terbuka | 0.4 s | 1 |
| `ui/letter_slide` | Surat naik dari amplop | 0.4 s | 1 |
| `ui/paper_button` | Tombol kertas ditekan (Done, dst.) | 0.15 s | 2 |
| `book/finding` | Loop lembut saat mencari meja ("Finding your table") | 2 s loop | 1 |
| `book/place` | Buku diletakkan (meja atau cubit) | 0.5 s | 1 |
| `book/open` | Buku pop-up terbuka, halaman berdiri | 1.0 s | 1 |
| `book/ready` | Kartu "Ready!" | 0.6 s | 1 |
| `creature/step_out` | Hewan keluar dari barisan di belakang buku dan maju ke buku (langkah kertas ringan) | 0.5 s | 2 |
| `creature/bounce_wrong` | Hewan memantul setelah jawaban salah | 0.4 s | 2 |
| `creature/cheer` | Hewan bersorak setelah benar | 0.6 s | 3 |
| `creature/hop` | Satu lompatan kecil (barisan bergeser, hewan disentuh di menu) | 0.15 s | 3 |
| `creature/fly_to_score` | Hewan terbang naik ke papan skor setelah benar (desir kertas naik) | 0.8 s | 1 |
| `balloon/rise` | Balon muncul dari meja (sangat pelan) | 0.3 s | 2 |
| `balloon/pop` | Balon ditusuk | 0.3 s | 3 |
| `orb/grab` | Kristal dicubit | 0.12 s | 2 |
| `orb/join` | Dua kristal menyatu jadi orb | 0.6 s | 1 |
| `orb/drop` | Kristal dilepas di meja | 0.15 s | 2 |
| `answer/right` | Jawaban benar (dua sampai tiga nada naik) | 0.7 s | 2 |
| `answer/wrong` | Jawaban salah ("Try again!") | 0.5 s | 2 |
| `answer/points` | Angka "+N points" naik | 0.4 s | 1 |
| `race/wave_start` | Gelombang mulai ("Wave 1 of 3") | 1.0 s | 1 |
| `race/boss_start` | Ronde boss mulai | 1.5 s | 1 |
| `race/tick` | Tiap detik pada 10 detik terakhir | 0.1 s | 1 |
| `race/tick_last` | Tiga detik terakhir (lebih tinggi) | 0.1 s | 1 |
| `race/time_up` | "Time's up!" | 0.8 s | 1 |
| `race/robot_answer` | Robot menjawab benar (dari arah jendelanya, pelan) | 0.3 s | 2 |
| `race/overtake` | Pemain naik peringkat | 0.6 s | 1 |
| `reward/star` | Tiap bintang muncul di rekap (dimainkan 1 sampai 3 kali berurutan) | 0.5 s | 3 (nada naik) |
| `reward/badge` | Lencana sorotan muncul | 0.8 s | 1 |
| `reward/results` | Kartu rekap terbuka | 1.2 s | 1 |
| `music/menu` | Menu dan penempatan buku, tenang, marimba | 30 sampai 60 s loop | 1 |
| `music/race` | Selama lomba, lebih cepat dan ceria | 30 sampai 60 s loop | 1 |
| `music/boss` | Ronde boss 20 detik, lebih tegang tapi tetap ramah | 20 s loop | 1 |

Varian diberi akhiran `_1`, `_2`, `_3` (contoh `balloon/pop_1.ogg`).

## 4. Manifest `sounds/manifest.json`

Satu entri per berkas:

```json
{
  "name": "balloon/pop_1",
  "file": "sounds/balloon/pop_1.ogg",
  "duration_s": 0.28,
  "channels": 1,
  "loop": false,
  "loudness_lufs": -18.2,
  "peak_dbfs": -1.4,
  "bytes": 9120,
  "caption": "Pop!",
  "source": "generated",
  "generator": "scripts/audio/balloon.py",
  "license": "CC0-1.0",
  "notes": ""
}
```

- `caption`: teks pendek untuk teks bunyi di layar (aksesibilitas), bahasa Inggris, misalnya "Pop!", "Correct!", "Tick".
- `source`: `generated`, atau untuk sampel CC0 isi `"cc0-sample"` plus `source_url`, `author`, dan `original_license`.

## 5. Checklist penerimaan

1. Semua berkas di bagian 3 ada, termasuk variannya, dan tercatat di manifest.
2. Semua memenuhi bagian 2 (format, mono, level, ukuran, tanpa klik, loop mulus).
3. `scripts/audio/` bisa membangun ulang semua bunyi hasil sintesis dengan satu perintah.
4. Tiap sampel CC0 punya sumber dan lisensi di manifest dan di `LICENSE-THIRD-PARTY.md`.
5. Halaman pratinjau `sounds/preview.html` memutar setiap bunyi dengan namanya (untuk Zia mendengarkan).
6. Tidak ada suara manusia nyata, merek, atau melodi berhak cipta.
