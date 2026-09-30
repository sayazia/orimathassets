# Brief UI U1: banner, tombol, teks navigasi, ikon, dan lencana Numeria Arena

Untuk agen aset di repo `sayazia/orimathassets` (30 Sep 2026, permintaan Zia). Gaya mengikuti dua contoh "BEGIN HERE" yang disetujui Zia: huruf kertas timbul yang seolah muncul dari latar. Aturan umum (arah seni, palet, legal, checklist) ada di `docs/brief/ATURAN-UMUM.md` di repo aset. Nama produk kini **Numeria Arena**.

## Prompt (tempel)

```
Kerjakan batch U1 untuk game Numeria Arena: semua banner, tombol, teks navigasi, ikon,
dan lencana di brief ini, dengan gaya huruf kertas timbul seperti contoh "BEGIN HERE"
(utama: emboss transparan yang menyatu dengan latar apa pun; sebagian kecil: huruf krem di
atas warna; kartu soal dan tag angka: kertas padat).
Huruf dibuat sendiri dari bentuk (bukan font pihak ketiga), semua dibangun dari kode di
scripts/ui/, keluaran SVG + PNG, tercatat di ui2d/manifest.json, dengan halaman pratinjau
ui2d/preview.html di atas latar kertas buram (DOF). Kerjakan urut prioritas: P1 dulu.
Di akhir sesi tulis ringkasan: berkas, ukuran, warna, dan keputusan yang berbeda beserta alasannya.
```

## 1. Sistem gaya (berlaku untuk semua)

### 1.1 Tiga perlakuan

**Aturan utama (keputusan Zia): semua tombol, banner, dan panel memakai E**, efek timbul yang menyatu dengan latar apa pun di belakangnya, seperti contoh "BEGIN HERE" putih. W hanya untuk yang warnanya punya arti, K hanya untuk angka yang harus selalu terbaca.

| Kode | Nama | Isi bentuk | Huruf | Efek timbul dan bayangan |
|---|---|---|---|---|
| **E** | Emboss transparan (utama) | **Tanpa isi warna** (0%, paling banyak putih 8% supaya sedikit terangkat). Latar di belakang terlihat menembus | Tanpa isi warna juga; bentuk huruf hanya terlihat dari tepi timbulnya | Tepi terang: putih 55 sampai 65% di sisi kiri atas (lebar 2 sampai 3 px pada tinggi M). Tepi gelap: hitam 12 sampai 18% di sisi kanan bawah. Bayangan jatuh bentuk: kanan bawah, offset 6 px, blur 14 px, hitam 15%. Huruf: sama tetapi setengah kekuatan, offset 2 px |
| **W** | Di atas warna | Warna peran (tabel 1.2), padat | Krem `#FFF8EC`, sisi gelap huruf `#F6E3C0`, sedikit timbul | Bayangan bentuk sama dengan E. Huruf: 2 px, warna latar digelapkan 20% |
| **K** | Kertas padat | Kertas `#FFFDF8`, padat | Angka dan teks tinta (`#3A3F4B` atau `#1F4FA3`), tidak timbul | Bayangan bentuk sama dengan E |

Cahaya selalu dari kiri atas. Area di luar bentuk selalu **transparan** (efek dan bayangan ikut terpanggang di PNG).

Uji wajib E: setiap berkas E harus tetap terbaca di atas empat latar uji: kertas terang buram (DOF), kertas krem, teal `#3FB6A0`, dan foto ruangan buram yang agak gelap. Di game, elemen E yang melayang di ruangan nyata (passthrough) akan diletakkan di atas panel kertas atau halaman buku, tidak langsung di atas ruangan.

### 1.2 Warna (sama dengan game saat ini)

| Peran | Hex | Dipakai untuk |
|---|---|---|
| Kertas | `#FFF8EC` | huruf krem, kartu soal, label jawaban |
| Kertas belakang | `#F6E3C0` | sisi gelap huruf, latar pratinjau browser |
| Tinta | `#3A3F4B` | angka jawaban, teks kecil di atas kertas |
| Tinta soal | `#1F4FA3` | teks soal, jam hitung mundur |
| Coral (misi bilangan) | `#F2716B` | Balloon Burst |
| Cobalt (misi kali bagi) | `#3469C4` | Orb Forge, robot Clip |
| Teal (misi pecahan) | `#3FB6A0` | Robot Race, robot Crease |
| Sunflower (misi desimal) | `#F9C74F` | misi desimal |
| Violet (misi ukuran) | `#B198EA` | misi pengukuran |
| Benar | `#5DB85B` (latar), `#2F7D32` (teks) | "+N points", bendera hijau, tombol lanjut |
| Coba lagi | `#F8961E` | "Try again!" (oranye, bukan merah menakutkan) |
| Salah | `#E04A44` (latar), `#C62828` (teks) | bendera merah, jam 10 detik terakhir |
| Emas | `#E8B64C` | juara 1, bintang, lencana |
| Perak | `#B8BEC8` | juara 2 (baru) |
| Perunggu | `#C98A5A` | juara 3 (baru) |
| Ungu boss | `#6D597A` | ronde boss |

Tombol "Done" di game sekarang hijau pudar `#81B29A`, di luar palet; di U1 menjadi tombol E seperti tombol lain.

### 1.3 Bentuk

| Kode | Bentuk | Rasio | Sudut |
|---|---|---|---|
| **R** | Persegi panjang (seperti contoh) | bebas, tinggi tetap per kelas | siku, tepi kertas sedikit tidak rata (0.5 px) |
| **C** | Lingkaran | 1 : 1 | |
| **J** | Jajar genjang | bebas | miring 12 derajat ke kanan |
| **P** | Pita (ribbon) | bebas | ujung berlekuk V, untuk lencana dan judul hadiah |
| **B** | Gelembung bicara | 1.4 : 1 | ekor di kiri bawah, untuk robot |

### 1.4 Kelas ukuran

Ukuran PNG dibuat 2x untuk ketajaman di headset; game menampilkannya pada ukuran dunia (meter) di kolom terakhir.

| Kelas | Tinggi PNG | Tinggi huruf | Contoh | Ukuran di dunia (tinggi) |
|---|---|---|---|---|
| XL | 400 px | 190 px | judul game | 0.07 m |
| L | 256 px | 120 px | banner gelombang, "Time's up!" | 0.05 m |
| M | 160 px | 72 px | tombol, judul rekap | 0.035 m |
| S | 96 px | 44 px | label nama game, nama robot, tag | 0.022 m |
| XS | 64 px | 30 px | kata kecil pada HUD ("pts", "solved") | 0.016 m |
| Ikon besar | 512 x 512 | | ikon game, lencana | 0.06 m |
| Ikon kecil | 128 x 128 | | ikon tombol | 0.02 m |

Jarak tepi bentuk ke huruf: 0.6 x tinggi huruf di kiri dan kanan, 0.35 x di atas dan bawah (seperti contoh).

### 1.5 Huruf kertas (P1, paling penting)

Karena banyak teks berisi angka yang berubah (skor, jam, soal, jawaban), buat **satu set huruf kertas** yang dipakai game untuk menyusun teks dinamis dengan gaya yang sama:

- Huruf besar A sampai Z, angka 0 sampai 9, simbol `+ − - x ÷ = ? / . , : % ! ' ( ) ²` (minus dan tanda hubung dibedakan) dan spasi. Bahasa Indonesia tidak butuh huruf tambahan.
- Angka harus sangat jelas untuk anak: 1 dan 7 berbeda jelas, 0 lebih sempit dari O, 6 dan 9 tidak simetris sempurna.
- Keluaran: SVG per glyph, **atlas PNG** (tinggi glyph 128 px, dua versi: perlakuan T dan W) dan `ui2d/font/paper_glyphs.json` berisi lebar maju, bearing, dan kerning per pasangan.
- Teks panjang (kalimat petunjuk) tetap memakai huruf biasa yang mudah dibaca di game; huruf kertas untuk judul, tombol, angka, dan label pendek.

## 2. Daftar lengkap

Kolom: **Teks** (huruf besar semua), **Bentuk** (1.3), **Perlakuan** (1.1), **Warna latar**, **Kelas** (1.4), **Prioritas**. Teks yang berisi angka berubah ditulis dengan `#`; buat kata tetapnya saja, angka disusun game dari huruf kertas.

### 2.1 Merek dan menu (P1)

| Berkas | Teks | Bentuk | Perl. | Latar | Kelas |
|---|---|---|---|---|---|
| `title_numeria_arena` | NUMERIA ARENA | R | E | (latar di belakangnya) | XL |
| `menu_robot_race` | ROBOT RACE | J | E | (latar di belakangnya) | S |
| `menu_balloon_burst` | BALLOON BURST | J | E | (latar di belakangnya) | S |
| `menu_orb_forge` | ORB FORGE | J | E | (latar di belakangnya) | S |
| `menu_factory_sort` (P3) | FACTORY SORT | J | E | (latar di belakangnya) | S |
| `menu_bridge_builder` (P3) | BRIDGE BUILDER | J | E | (latar di belakangnya) | S |
| `menu_balance_gate` (P3) | BALANCE GATE | J | E | (latar di belakangnya) | S |
| `menu_measure_hunt` (P3) | MEASURE HUNT | J | E | (latar di belakangnya) | S |

Aset merek lama yang masih bernama Foldlings (`2d/brand/logo_foldlings.svg`, ikon aplikasi, favicon, thumbnail Devpost, pratinjau sosial) dibuat ulang dengan nama **Numeria Arena**.

### 2.2 Penempatan buku (P1)

| Berkas | Teks | Bentuk | Perl. | Latar | Kelas |
|---|---|---|---|---|---|
| `status_finding_table` | FINDING YOUR TABLE | R | E | (latar di belakangnya) | M |
| `status_pinch_to_place` | PINCH TO PLACE THE BOOK | R | E | (latar di belakangnya) | M |
| `status_or_wait` | OR WAIT # S | R | E | (latar di belakangnya) | S |
| `status_ready` | READY! | C | W | benar `#5DB85B` | L |

### 2.3 HUD lomba (P1)

| Berkas | Teks | Bentuk | Perl. | Latar | Kelas | Catatan |
|---|---|---|---|---|---|---|
| `race_wave_1`, `_2`, `_3` | WAVE 1 OF 3, WAVE 2 OF 3, WAVE 3 OF 3 | R | E | (latar di belakangnya) | L | |
| `race_boss_round` | BOSS ROUND | P | W | ungu boss `#6D597A` | L | |
| `race_double_points` | DOUBLE POINTS! | J | W | emas `#E8B64C` | M | di bawah BOSS ROUND |
| `race_20_seconds` | 20 SECONDS | R | E | (latar di belakangnya) | S | |
| `race_times_up` | TIME'S UP! | C | W | salah `#E04A44` | L | lingkaran besar |
| `race_clock_frame` | (bingkai jam, tanpa teks) | R | E | (latar di belakangnya) | M | ruang untuk "0:42"; versi kedua bertepi merah untuk 10 detik terakhir |
| `race_place_1st`, `_2nd`, `_3rd` | 1ST, 2ND, 3RD | C | W | emas, perak, perunggu | S | di kiri baris papan skor |
| `race_name_you` | YOU | R | W | coral | S | |
| `race_name_clip` | CLIP (BOT) | R | W | cobalt `#3469C4` | S | juga label di bawah jendela robot |
| `race_name_crease` | CREASE (BOT) | R | W | teal `#3FB6A0` | S | |
| `race_word_solved` | SOLVED | R | E | (latar di belakangnya) | XS | "# SOLVED, # PTS" |
| `race_word_pts` | PTS | R | E | (latar di belakangnya) | XS | |
| `robot_nice` | NICE! | B | W | cobalt atau teal (dua versi) | S | gelembung robot |
| `robot_yay` | YAY! | B | W | dua versi | S | |
| `robot_got_it` | GOT IT! | B | W | dua versi | S | |

### 2.4 Soal dan umpan balik (P1)

| Berkas | Teks | Bentuk | Perl. | Latar | Kelas | Catatan |
|---|---|---|---|---|---|---|
| `card_question` | (kartu kosong) | R | K | kertas | M | game menulis soal dengan tinta soal `#1F4FA3`; lebar 3 varian: pendek, sedang, panjang |
| `hint_pop_right_answer` | POP THE RIGHT ANSWER | R | E | (latar di belakangnya) | S | |
| `hint_join_2_crystals` | JOIN 2 CRYSTALS TO MAKE | R | E | (latar di belakangnya) | S | angka target menyusul |
| `hint_make` | MAKE | R | E | (latar di belakangnya) | S | angka target menyusul |
| `feedback_points` | POINTS | J | W | benar `#5DB85B` | M | "+# POINTS" |
| `feedback_try_again` | TRY AGAIN! | J | W | coba lagi `#F8961E` | M | |
| `feedback_it_was` | IT WAS | J | W | coba lagi | M | jawaban benar menyusul |
| `feedback_missed` | MISSED | J | E | (latar di belakangnya) | S | |
| `tag_answer_balloon` | (tag kosong) | R | K | kertas | S | tergantung di bawah keranjang balon, angka tinta `#3A3F4B`; dua tinggi: biasa dan pecahan (1.5x) |
| `tag_answer_crystal` | (tag kosong) | R | K | kertas | S | sama, di atas kristal |
| `timer_strip` | (strip tanpa teks) | R | W | benar lalu coba lagi | XS | strip bonus kecepatan 8 detik; dua warna, game memotong panjangnya |
| `score_points` | POINTS | R | E | (latar di belakangnya) | M | "# POINTS" di mode latihan |

### 2.5 Rekap (P1)

| Berkas | Teks | Bentuk | Perl. | Latar | Kelas |
|---|---|---|---|---|---|
| `recap_title` | RACE RESULTS | P | E | (latar di belakangnya) | L |
| `recap_place_1st`, `_2nd`, `_3rd` | 1ST, 2ND, 3RD | C | W | emas, perak, perunggu | ikon besar |
| `badge_label_best_comeback` | BEST COMEBACK | P | W | emas | S |
| `badge_label_most_improved` | MOST IMPROVED | P | W | emas | S |
| `badge_label_sharpest_aim` | SHARPEST AIM | P | W | emas | S |
| `badge_label_steady_streak` | STEADY STREAK | P | W | emas | S |
| `badge_label_brave_try` | BRAVE TRY | P | W | emas | S |
| `button_done` | DONE | R | E | (latar di belakangnya) | M |

Lencana 3D (`rewards/badge_*.glb`) sudah ada dari B7; pita teks di atas menempel di bawahnya.

### 2.6 Browser (sebelum masuk XR) (P1)

| Berkas | Teks | Bentuk | Perl. | Latar | Kelas |
|---|---|---|---|---|---|
| `button_start` | START | R | E | (latar di belakangnya) | M |
| `button_enter_xr` | ENTER XR | R | E | (latar di belakangnya) | M |
| `web_subtitle` | (tidak dibuat; kalimat panjang tetap huruf biasa) | | | | |

### 2.7 Jeda dan penyimpanan (P2, fitur sudah ada, tampilan belum)

| Berkas | Teks | Bentuk | Perl. | Latar | Kelas |
|---|---|---|---|---|---|
| `pause_paused` | PAUSED | C | E | (latar di belakangnya) | L |
| `pause_welcome_back` | WELCOME BACK! | R | E | (latar di belakangnya) | M |
| `notice_not_saved` | PROGRESS NOT SAVED ON THIS DEVICE | R | E | (latar di belakangnya) | XS |

### 2.8 Tombol umum (P2, untuk menu yang akan datang)

Semua bentuk R, perlakuan **E**, kelas M, dengan ikon kecil di kiri (bagian 2.9). Keadaan tekan: tepi terang dan gelap bertukar (tombol terlihat masuk ke kertas); keadaan mati (off): efek setengah kekuatan.

| Berkas | Teks |
|---|---|
| `button_play` | PLAY |
| `button_play_again` | PLAY AGAIN |
| `button_next` | NEXT |
| `button_back` | BACK |
| `button_menu` | MENU |
| `button_resume` | RESUME |
| `button_settings` | SETTINGS |
| `button_skip` | SKIP |
| `button_yes`, `button_no` | YES, NO |
| `button_sound_on`, `_off` | SOUND ON, SOUND OFF |
| `button_music_on`, `_off` | MUSIC ON, MUSIC OFF |
| `button_captions_on`, `_off` | CAPTIONS ON, CAPTIONS OFF |
| `button_language_en`, `_id` | ENGLISH, BAHASA INDONESIA |

### 2.9 Ikon kecil (P2, 128 px, bentuk C, perlakuan E)

Simbol bentuk saja, tanpa huruf, timbul seperti tombol yang memakainya.

`back` (panah kiri), `next` (panah kanan), `home` (rumah kertas), `replay` (panah melingkar), `play` (segitiga), `pause` (dua batang), `settings` (roda gigi kertas), `sound_on`, `sound_off`, `music`, `captions` (kotak dengan dua garis), `language` (dua gelembung bicara), `check` (centang), `cross` (silang lembut, bukan merah), `star`, `clock`, `robot` (kepala robot sederhana), `you` (kepala orang sederhana), `trophy`, `lock`, `info` (huruf i dari bentuk), `close`, `hand_poke` (telunjuk), `hand_pinch` (dua jari mencubit).

### 2.10 Ikon besar (P2, 512 px, bentuk C, perlakuan E)

- Ikon 6 jenis game dan 5 misi yang sudah ada di `2d/icons/`: buat ulang dengan gaya timbul ini supaya seragam.
- Tambahan: `icon_robot_race` (dua robot dan bendera balap kotak hitam putih), `icon_practice` (satu buku terbuka).

### 2.11 Teks Indonesia untuk versi `_id`

Status: **usulan, menunggu persetujuan Zia**. Jangan buat versi `_id` sebelum baris ini diubah menjadi "disetujui".

Nama game (ROBOT RACE, BALLOON BURST, ORB FORGE, dan empat game berikutnya), NUMERIA ARENA, CLIP (BOT), CREASE (BOT), ENGLISH, dan BAHASA INDONESIA **tetap sama** di kedua bahasa, jadi tidak perlu versi `_id`.

| Berkas | EN | ID |
|---|---|---|
| `status_finding_table` | FINDING YOUR TABLE | MENCARI MEJAMU |
| `status_pinch_to_place` | PINCH TO PLACE THE BOOK | CUBIT UNTUK MENARUH BUKU |
| `status_or_wait` | OR WAIT # S | ATAU TUNGGU # DETIK |
| `status_ready` | READY! | SIAP! |
| `race_wave_1`, `_2`, `_3` | WAVE 1 OF 3 | GELOMBANG 1 DARI 3 |
| `race_boss_round` | BOSS ROUND | RONDE BOS |
| `race_double_points` | DOUBLE POINTS! | POIN GANDA! |
| `race_20_seconds` | 20 SECONDS | 20 DETIK |
| `race_times_up` | TIME'S UP! | WAKTU HABIS! |
| `race_place_1st`, `_2nd`, `_3rd` | 1ST, 2ND, 3RD | KE-1, KE-2, KE-3 |
| `race_name_you` | YOU | KAMU |
| `race_word_solved` | SOLVED | BENAR |
| `race_word_pts` | PTS | POIN |
| `robot_nice` | NICE! | MANTAP! |
| `robot_yay` | YAY! | HORE! |
| `robot_got_it` | GOT IT! | BERHASIL! |
| `hint_pop_right_answer` | POP THE RIGHT ANSWER | LETUSKAN JAWABAN YANG BENAR |
| `hint_join_2_crystals` | JOIN 2 CRYSTALS TO MAKE | GABUNGKAN 2 KRISTAL MENJADI |
| `hint_make` | MAKE | BUAT |
| `feedback_points`, `score_points` | POINTS | POIN |
| `feedback_try_again` | TRY AGAIN! | COBA LAGI! |
| `feedback_it_was` | IT WAS | JAWABANNYA |
| `feedback_missed` | MISSED | TERLEWAT |
| `recap_title` | RACE RESULTS | HASIL LOMBA |
| `recap_place_1st`, `_2nd`, `_3rd` | 1ST, 2ND, 3RD | KE-1, KE-2, KE-3 |
| `badge_label_best_comeback` | BEST COMEBACK | BANGKIT TERBAIK |
| `badge_label_most_improved` | MOST IMPROVED | PALING BERKEMBANG |
| `badge_label_sharpest_aim` | SHARPEST AIM | BIDIKAN TERTAJAM |
| `badge_label_steady_streak` | STEADY STREAK | BENAR BERUNTUN |
| `badge_label_brave_try` | BRAVE TRY | BERANI MENCOBA |
| `button_done` | DONE | SELESAI |
| `button_start` | START | MULAI |
| `button_enter_xr` | ENTER XR | MASUK XR |
| `pause_paused` | PAUSED | JEDA |
| `pause_welcome_back` | WELCOME BACK! | SELAMAT DATANG KEMBALI! |
| `notice_not_saved` | PROGRESS NOT SAVED ON THIS DEVICE | PROGRES TIDAK TERSIMPAN DI PERANGKAT INI |
| `button_play` | PLAY | MAIN |
| `button_play_again` | PLAY AGAIN | MAIN LAGI |
| `button_next` | NEXT | LANJUT |
| `button_back` | BACK | KEMBALI |
| `button_menu` | MENU | MENU |
| `button_resume` | RESUME | LANJUTKAN |
| `button_settings` | SETTINGS | PENGATURAN |
| `button_skip` | SKIP | LEWATI |
| `button_yes`, `button_no` | YES, NO | YA, TIDAK |
| `button_sound_on`, `_off` | SOUND ON, SOUND OFF | SUARA NYALA, SUARA MATI |
| `button_music_on`, `_off` | MUSIC ON, MUSIC OFF | MUSIK NYALA, MUSIK MATI |
| `button_captions_on`, `_off` | CAPTIONS ON, CAPTIONS OFF | TEKS NYALA, TEKS MATI |

Teks Indonesia rata-rata lebih panjang: lebar bentuk mengikuti teks, tinggi dan kelas ukuran tetap sama.

## 3. Catatan untuk seragam

1. Satu set huruf kertas untuk semua (1.5); jangan membuat bentuk huruf berbeda per berkas.
2. Tinggi huruf mengikuti kelas; jangan diskalakan bebas.
3. Default E. Pakai W hanya pada berkas yang ditulis W di bagian 2 (warnanya punya arti: benar, salah, waktu habis, boss, juara, identitas robot, lencana). Pakai K hanya untuk kartu soal dan tag angka.
4. Tidak ada emdash dalam teks apa pun.
5. Bahasa Indonesia: setiap berkas berteks dibuat juga versi `_id` dengan teks di bagian 2.11; nama berkas sama dengan akhiran `_id`. Berkas tanpa teks (kartu kosong, bingkai, strip, ikon) tidak perlu versi `_id`.

## 4. Manifest `ui2d/manifest.json`

```json
{
  "name": "race_times_up",
  "file": "ui2d/race/race_times_up.png",
  "svg": "ui2d/race/race_times_up.svg",
  "text": "TIME'S UP!",
  "shape": "circle",
  "treatment": "on_color",
  "background": "#E04A44",
  "size_class": "L",
  "px": [512, 512],
  "world_height_m": 0.05,
  "priority": 1
}
```

`treatment` berisi `emboss` (E), `on_color` (W), atau `solid_paper` (K).

## 5. Checklist penerimaan

1. Semua berkas P1 ada (SVG + PNG transparan) dan tercatat di manifest; P2 dan P3 boleh menyusul.
2. Setiap berkas E lolos uji empat latar (bagian 1.1) dan tampil di pratinjau di atas keempatnya.
3. Huruf kertas lengkap dengan atlas dan metrik; angka lolos uji baca (1/7, 0/O, 6/9) di ukuran XS.
4. Warna persis tabel 1.2; perbedaan dicatat dengan alasan.
5. `ui2d/preview.html` menampilkan semua berkas di atas latar kertas buram, dan satu contoh HUD lomba tersusun.
6. Tanpa font pihak ketiga, tanpa merek, tanpa emdash.
