# Numeria Arena UI, batch U1: ringkasan

Dikerjakan 30 Sep 2026 atas permintaan Zia. Semua banner, tombol, kata HUD, lencana, dan ikon batch U1 dengan gaya
huruf kertas timbul seperti contoh "BEGIN HERE", ditambah satu set huruf kertas untuk teks dinamis (skor, jam, soal).
Semuanya dibangun dari kode di `scripts/ui/` tanpa font pihak ketiga, tanpa merek lain, dan tanpa emdash.

```
npm run build:ui            # semua berkas ui2d/, manifest, dan preview
npm run build:ui -- race_   # hanya berkas yang namanya diawali race_
npm run build:2d -- brand   # logo, ikon aplikasi, favicon, dan gambar promosi Numeria Arena
```

Buka `ui2d/preview.html` untuk melihat semua berkas di atas latar kertas buram (DOF), atlas huruf, uji baca angka,
dan satu contoh HUD lomba yang angkanya disusun dari atlas huruf kertas.

## Berkas

| Folder | Isi | Jumlah |
|---|---|---|
| `ui2d/font/` | `paper_glyphs_T.png`, `_W.png`, `_I.png` (atlas 1024 x 888, glyph 128 px), `paper_glyphs.json` (sel atlas, lebar maju, bearing kiri dan kanan, kerning per pasangan, lebar angka tabular), SVG per glyph di `glyphs/T/`, `glyphs/W/`, `glyphs/I/` | 52 glyph x 3 |
| `ui2d/brand/`, `menu/`, `placement/`, `race/`, `question/`, `recap/`, `web/` | berkas P1 (SVG + PNG transparan) | 61 |
| `ui2d/pause/`, `buttons/`, `icons/`, `icons_large/` | berkas P2 | 88 |
| `ui2d/menu/` | empat label menu P3 (Factory Sort, Bridge Builder, Balance Gate, Measure Hunt) | 4 |
| `ui2d/manifest.json` | satu entri per berkas, format bagian 4 brief, ditambah `letter_px`, `slots`, dan `note` | 153 |
| `2d/brand/` | `logo_numeria_arena` dan `_dark` (PNG lebar 1200), `app_icon`, `app_icon_maskable`, `favicon`, `devpost_thumbnail`, `social_preview` dibuat ulang; `logo_foldlings*` dihapus | 7 set |

Huruf kertas: A sampai Z, 0 sampai 9, `+ − × ÷ = ? / . , : % ! ' ( ) ²` dan spasi. Alias di JSON: `x` dan `*` menjadi `×`,
`-` menjadi `−`. Angka dibuat jelas untuk anak: 1 punya bendera dan kaki (tidak mirip 7 atau I), 0 lebih sempit
dari O (lebar maju 4.4 lawan 5.7 satuan), 6 berkait terbuka di atas sedangkan 9 bertangkai lurus, jadi keduanya bukan
putaran satu sama lain. Bentuk huruf yang sudah ada di stiker BEGIN HERE dipakai persis.

## Warna

Semua warna persis tabel 1.2: kertas #FFF8EC, kertas belakang #F6E3C0, tinta #3A3F4B, tinta soal #1F4FA3, coral #F2716B,
cobalt #3469C4, teal #3FB6A0, sunflower #F9C74F, violet #B198EA, benar #5DB85B, coba lagi #F8961E, salah #E04A44,
emas #E8B64C, perak #B8BEC8, perunggu #C98A5A, ungu boss #6D597A. Muka bentuk T #FFFDF8; huruf T: sisi terang #FFFFFF,
sisi gelap #EADFCB, bayangan #E6D9C2. Huruf W: sisi gelap #F6E3C0, bayangan warna latar digelapkan 20%.
Tombol Done kini benar #5DB85B (bukan #81B29A).

## Keputusan yang berbeda dari brief, dan alasannya

1. **Kata kecil XS di atas kertas memakai tinta #3A3F4B** (perlakuan `ink_on_paper`): `race_word_solved`, `race_word_pts`,
   `notice_not_saved`. Krem di atas putih setinggi 30 px hampir tak terbaca. Dipilih Zia di thread; bisa dikembalikan
   dengan `XS_INK = false` di `scripts/ui/items.mjs`. Untuk alasan yang sama ada atlas ketiga `paper_glyphs_I.png`
   (tinta) untuk angka jawaban dan teks kecil di atas kertas, sesuai peran "Tinta" di tabel 1.2.
2. **Bayangan bentuk** memakai angka brief (offset 6 px, blur 14 px, hitam 18%) pada ukuran M, lalu diskalakan dengan
   tinggi huruf supaya XL tidak tampak tipis dan XS tidak kotor. Bayangan memudar ke arah tepi kiri sehingga tepi kiri
   menyatu dengan latar, ditambah garis atas yang sangat samar, seperti stiker yang sudah disetujui.
3. **Bayangan huruf 2 px** berlaku pada huruf M (72 px) dan diskalakan dengan tinggi huruf (paling kecil 1.5 px).
4. **Tinggi PNG**: persegi panjang dan jajar genjang tepat setinggi kelasnya. Lingkaran, gelembung, dan pita lebih tinggi
   karena bentuknya (lingkaran harus memuat teks, gelembung 1.4 : 1, pita punya ekor), sedangkan tinggi huruf tetap
   sesuai kelas. `world_height_m` di manifest diskalakan dengan tinggi PNG sehingga huruf di dunia tetap berukuran kelasnya.
   Teks lingkaran dan gelembung dipatah ke dua baris bila lebih bulat (TIME'S / UP!).
5. **Slot angka**: berkas yang catatannya menyebut angka menyusul punya ruang kosong selebar angka tabular, dicatat di
   `slots` manifest (x, y, w, h dalam px PNG): `status_or_wait` (OR WAIT _ S), `hint_join_2_crystals`, `hint_make`,
   `feedback_points` (ruang untuk "+10" di depan POINTS), `feedback_it_was`, `score_points`. Bentuk kosong (bingkai jam,
   tag jawaban, kartu soal) juga punya `slots` dengan teks yang muat (`0:00`, `000`).
6. **Ukuran bebas yang saya pilih**: kartu soal lebar muka 480, 800, 1120 px; tag jawaban muat tiga angka S, versi pecahan
   1.5x tinggi; strip waktu 640 x 22 px (game memotong panjangnya); `recap_place_*` lingkaran 440 px di kanvas 512 dengan
   huruf L; bingkai jam merah bertepi #E04A44 selebar 0.075 tinggi huruf.
7. **Pita (P)**: ekor belakang memakai warna latar digelapkan 10% dan lipatannya 20% (T: 5% dan 10%). Ini nada dari warna
   yang sama, bukan warna ketiga, supaya pita terbaca sebagai kertas terlipat.
8. **Ikon di tombol**: tombol W memakai ikon krem timbul, tombol T memakai ikon timbul senada seperti hurufnya. MENU memakai
   ikon rumah, SKIP memakai panah ganda dengan batang, RESUME memakai segitiga play. Untuk tombol OFF saya tambahkan ikon
   bercoret: `sound_off` (brief), `music_off`, `captions_off`.
9. **Ikon besar**: warna mengikuti warna menu di brief ini (Factory Sort sunflower, Bridge Builder violet, Balance Gate coral,
   Measure Hunt violet), bukan warna lencana lama di `2d/icons/`. Nama berkas sama seperti ikon lama (`game_*`, `mission_*`)
   ditambah `icon_robot_race` dan `icon_practice`. Bendera balap memakai kotak krem dan kotak kosong, karena maksimal
   dua warna; hitam putih asli tidak dipakai.
10. **Krem di atas sunflower** (menu Factory Sort, ikon desimal) kontrasnya rendah. Warna tetap sesuai tabel; bila perlu
    lebih jelas, huruf bisa diganti tinta khusus untuk sunflower.
11. **Merek**: logo menjadi `logo_numeria_arena` (krem di atas teal) dan `_dark` (kertas senada). Ikon aplikasi dan favicon
    kini monogram NA dan N; bangau dan buku Foldlings dilepas. Gambar Devpost dan sosial memakai judul baru.
12. **Belum dikerjakan**: versi `_id` (P3), menunggu teks Indonesia disetujui Zia. `docs/BRIEF-ASET-ORIMATH.md` tidak ada di
    repo, jadi bagian 2, 4, 8, 9 brief utama tidak bisa saya periksa langsung; saya mengikuti aturan yang tertulis di brief U1.

## Daftar berkas

| Berkas | Teks | Bentuk | Perlakuan | Latar | Kelas | PNG (px) | Tinggi dunia (m) | P |
|---|---|---|---|---|---|---|---|---|
| `title_numeria_arena` | NUMERIA ARENA | rectangle | on_paper | #FFFDF8 | XL | 2076 x 400 | 0.07 | 1 |
| `title_numeria_arena_w` | NUMERIA ARENA | rectangle | on_color | #3FB6A0 | XL | 2076 x 400 | 0.07 | 1 |
| `menu_robot_race` | ROBOT RACE | parallelogram | on_color | #3FB6A0 | S | 422 x 96 | 0.022 | 1 |
| `menu_balloon_burst` | BALLOON BURST | parallelogram | on_color | #F2716B | S | 516 x 96 | 0.022 | 1 |
| `menu_orb_forge` | ORB FORGE | parallelogram | on_color | #3469C4 | S | 384 x 96 | 0.022 | 1 |
| `menu_factory_sort` | FACTORY SORT | parallelogram | on_color | #F9C74F | S | 484 x 96 | 0.022 | 3 |
| `menu_bridge_builder` | BRIDGE BUILDER | parallelogram | on_color | #B198EA | S | 502 x 96 | 0.022 | 3 |
| `menu_balance_gate` | BALANCE GATE | parallelogram | on_color | #F2716B | S | 482 x 96 | 0.022 | 3 |
| `menu_measure_hunt` | MEASURE HUNT | parallelogram | on_color | #B198EA | S | 494 x 96 | 0.022 | 3 |
| `status_finding_table` | FINDING YOUR TABLE | rectangle | on_paper | #FFFDF8 | M | 978 x 160 | 0.035 | 1 |
| `status_pinch_to_place` | PINCH TO PLACE THE BOOK | rectangle | on_paper | #FFFDF8 | M | 1252 x 160 | 0.035 | 1 |
| `status_or_wait` | OR WAIT # S | rectangle | on_paper | #FFFDF8 | S | 428 x 96 | 0.022 | 1 |
| `status_ready` | READY! | circle | on_color | #5DB85B | L | 640 x 644 | 0.1258 | 1 |
| `race_wave_1` | WAVE 1 OF 3 | rectangle | on_color | #3FB6A0 | L | 1104 x 256 | 0.05 | 1 |
| `race_wave_2` | WAVE 2 OF 3 | rectangle | on_color | #3FB6A0 | L | 1114 x 256 | 0.05 | 1 |
| `race_wave_3` | WAVE 3 OF 3 | rectangle | on_color | #3FB6A0 | L | 1114 x 256 | 0.05 | 1 |
| `race_boss_round` | BOSS ROUND | ribbon | on_color | #6D597A | L | 1338 x 302 | 0.059 | 1 |
| `race_double_points` | DOUBLE POINTS! | parallelogram | on_color | #E8B64C | M | 822 x 160 | 0.035 | 1 |
| `race_20_seconds` | 20 SECONDS | rectangle | on_paper | #FFFDF8 | S | 386 x 96 | 0.022 | 1 |
| `race_times_up` | TIME'S UP! | circle | on_color | #E04A44 | L | 660 x 662 | 0.1293 | 1 |
| `race_clock_frame` | (kosong) | rectangle | on_paper | #FFFDF8 | M | 310 x 160 | 0.035 | 1 |
| `race_clock_frame_red` | (kosong) | rectangle | on_paper | #FFFDF8 | M | 310 x 160 | 0.035 | 1 |
| `race_place_1st` | 1ST | circle | on_color | #E8B64C | S | 156 x 156 | 0.0357 | 1 |
| `race_place_2nd` | 2ND | circle | on_color | #B8BEC8 | S | 164 x 164 | 0.0376 | 1 |
| `race_place_3rd` | 3RD | circle | on_color | #C98A5A | S | 164 x 164 | 0.0376 | 1 |
| `race_name_you` | YOU | rectangle | on_color | #F2716B | S | 176 x 96 | 0.022 | 1 |
| `race_name_clip` | CLIP (BOT) | rectangle | on_color | #3469C4 | S | 336 x 96 | 0.022 | 1 |
| `race_name_crease` | CREASE (BOT) | rectangle | on_color | #3FB6A0 | S | 430 x 96 | 0.022 | 1 |
| `race_word_solved` | SOLVED | rectangle | ink_on_paper | #FFFDF8 | XS | 182 x 64 | 0.016 | 1 |
| `race_word_pts` | PTS | rectangle | ink_on_paper | #FFFDF8 | XS | 116 x 64 | 0.016 | 1 |
| `robot_nice_cobalt` | NICE! | speech_bubble | on_color | #3469C4 | S | 190 x 176 | 0.0403 | 1 |
| `robot_nice_teal` | NICE! | speech_bubble | on_color | #3FB6A0 | S | 190 x 176 | 0.0403 | 1 |
| `robot_yay_cobalt` | YAY! | speech_bubble | on_color | #3469C4 | S | 184 x 170 | 0.039 | 1 |
| `robot_yay_teal` | YAY! | speech_bubble | on_color | #3FB6A0 | S | 184 x 170 | 0.039 | 1 |
| `robot_got_it_cobalt` | GOT IT! | speech_bubble | on_color | #3469C4 | S | 242 x 224 | 0.0513 | 1 |
| `robot_got_it_teal` | GOT IT! | speech_bubble | on_color | #3FB6A0 | S | 242 x 224 | 0.0513 | 1 |
| `card_question_short` | (kosong) | rectangle | on_paper | #FFFDF8 | M | 510 x 160 | 0.035 | 1 |
| `card_question_medium` | (kosong) | rectangle | on_paper | #FFFDF8 | M | 830 x 160 | 0.035 | 1 |
| `card_question_long` | (kosong) | rectangle | on_paper | #FFFDF8 | M | 1150 x 160 | 0.035 | 1 |
| `hint_pop_right_answer` | POP THE RIGHT ANSWER | rectangle | on_paper | #FFFDF8 | S | 694 x 96 | 0.022 | 1 |
| `hint_join_2_crystals` | JOIN 2 CRYSTALS TO MAKE | rectangle | on_paper | #FFFDF8 | S | 862 x 96 | 0.022 | 1 |
| `hint_make` | MAKE | rectangle | on_paper | #FFFDF8 | S | 306 x 96 | 0.022 | 1 |
| `feedback_points` | POINTS | parallelogram | on_color | #5DB85B | M | 656 x 160 | 0.035 | 1 |
| `feedback_try_again` | TRY AGAIN! | parallelogram | on_color | #F8961E | M | 624 x 160 | 0.035 | 1 |
| `feedback_it_was` | IT WAS | parallelogram | on_color | #F8961E | M | 654 x 160 | 0.035 | 1 |
| `feedback_missed` | MISSED | parallelogram | on_paper | #FFFDF8 | S | 280 x 96 | 0.022 | 1 |
| `tag_answer_balloon` | (kosong) | rectangle | on_paper | #FFFDF8 | S | 180 x 96 | 0.022 | 1 |
| `tag_answer_balloon_fraction` | (kosong) | rectangle | on_paper | #FFFDF8 | S | 180 x 132 | 0.0303 | 1 |
| `tag_answer_crystal` | (kosong) | rectangle | on_paper | #FFFDF8 | S | 180 x 96 | 0.022 | 1 |
| `tag_answer_crystal_fraction` | (kosong) | rectangle | on_paper | #FFFDF8 | S | 180 x 132 | 0.0303 | 1 |
| `timer_strip_correct` | (kosong) | rectangle | on_color | #5DB85B | XS | 654 x 64 | 0.016 | 1 |
| `timer_strip_try_again` | (kosong) | rectangle | on_color | #F8961E | XS | 654 x 64 | 0.016 | 1 |
| `score_points` | POINTS | rectangle | on_paper | #FFFDF8 | M | 614 x 160 | 0.035 | 1 |
| `recap_title` | RACE RESULTS | ribbon | on_color | #3FB6A0 | L | 1476 x 302 | 0.059 | 1 |
| `recap_place_1st` | 1ST | circle | on_color | #E8B64C | icon_large | 512 x 512 | 0.06 | 1 |
| `recap_place_2nd` | 2ND | circle | on_color | #B8BEC8 | icon_large | 512 x 512 | 0.06 | 1 |
| `recap_place_3rd` | 3RD | circle | on_color | #C98A5A | icon_large | 512 x 512 | 0.06 | 1 |
| `badge_label_best_comeback` | BEST COMEBACK | ribbon | on_color | #E8B64C | S | 592 x 112 | 0.0257 | 1 |
| `badge_label_most_improved` | MOST IMPROVED | ribbon | on_color | #E8B64C | S | 578 x 112 | 0.0257 | 1 |
| `badge_label_sharpest_aim` | SHARPEST AIM | ribbon | on_color | #E8B64C | S | 540 x 112 | 0.0257 | 1 |
| `badge_label_steady_streak` | STEADY STREAK | ribbon | on_color | #E8B64C | S | 584 x 112 | 0.0257 | 1 |
| `badge_label_brave_try` | BRAVE TRY | ribbon | on_color | #E8B64C | S | 456 x 112 | 0.0257 | 1 |
| `button_done` | DONE | rectangle | on_color | #5DB85B | M | 334 x 160 | 0.035 | 1 |
| `button_start` | START | rectangle | on_color | #3FB6A0 | M | 382 x 160 | 0.035 | 1 |
| `button_enter_xr` | ENTER XR | rectangle | on_color | #3469C4 | M | 520 x 160 | 0.035 | 1 |
| `pause_paused` | PAUSED | circle | on_color | #3469C4 | L | 690 x 692 | 0.1352 | 2 |
| `pause_welcome_back` | WELCOME BACK! | rectangle | on_color | #3FB6A0 | M | 796 x 160 | 0.035 | 2 |
| `notice_not_saved` | PROGRESS NOT SAVED ON THIS DEVICE | rectangle | ink_on_paper | #FFFDF8 | XS | 728 x 64 | 0.016 | 2 |
| `button_play` | PLAY | rectangle | on_color | #5DB85B | M | 430 x 160 | 0.035 | 2 |
| `button_play_again` | PLAY AGAIN | rectangle | on_color | #5DB85B | M | 712 x 160 | 0.035 | 2 |
| `button_next` | NEXT | rectangle | on_color | #3FB6A0 | M | 430 x 160 | 0.035 | 2 |
| `button_back` | BACK | rectangle | on_paper | #FFFDF8 | M | 444 x 160 | 0.035 | 2 |
| `button_menu` | MENU | rectangle | on_paper | #FFFDF8 | M | 442 x 160 | 0.035 | 2 |
| `button_resume` | RESUME | rectangle | on_color | #5DB85B | M | 550 x 160 | 0.035 | 2 |
| `button_settings` | SETTINGS | rectangle | on_color | #3469C4 | M | 604 x 160 | 0.035 | 2 |
| `button_skip` | SKIP | rectangle | on_paper | #FFFDF8 | M | 400 x 160 | 0.035 | 2 |
| `button_yes` | YES | rectangle | on_color | #5DB85B | M | 380 x 160 | 0.035 | 2 |
| `button_no` | NO | rectangle | on_paper | #FFFDF8 | M | 326 x 160 | 0.035 | 2 |
| `button_sound_on` | SOUND ON | rectangle | on_color | #3469C4 | M | 640 x 160 | 0.035 | 2 |
| `button_sound_off` | SOUND OFF | rectangle | on_paper | #FFFDF8 | M | 686 x 160 | 0.035 | 2 |
| `button_music_on` | MUSIC ON | rectangle | on_color | #3469C4 | M | 610 x 160 | 0.035 | 2 |
| `button_music_off` | MUSIC OFF | rectangle | on_paper | #FFFDF8 | M | 656 x 160 | 0.035 | 2 |
| `button_captions_on` | CAPTIONS ON | rectangle | on_color | #3469C4 | M | 766 x 160 | 0.035 | 2 |
| `button_captions_off` | CAPTIONS OFF | rectangle | on_paper | #FFFDF8 | M | 812 x 160 | 0.035 | 2 |
| `button_language_en` | ENGLISH | rectangle | on_color | #3FB6A0 | M | 552 x 160 | 0.035 | 2 |
| `button_language_id` | BAHASA INDONESIA | rectangle | on_color | #3FB6A0 | M | 1020 x 160 | 0.035 | 2 |
| `icon_back_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_back_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_next_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_next_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_skip_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_skip_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_home_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_home_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_replay_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_replay_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_play_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_play_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_pause_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_pause_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_settings_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_settings_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_sound_on_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_sound_on_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_sound_off_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_sound_off_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_music_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_music_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_music_off_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_music_off_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_captions_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_captions_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_captions_off_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_captions_off_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_language_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_language_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_check_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_check_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_cross_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_cross_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_close_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_close_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_star_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_star_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_clock_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_clock_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_robot_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_robot_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_you_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_you_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_trophy_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_trophy_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_lock_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_lock_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_info_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_info_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_hand_poke_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_hand_poke_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_hand_pinch_cobalt` | (kosong) | circle | on_color | #3469C4 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_hand_pinch_paper` | (kosong) | circle | ink_on_paper | #FFFDF8 | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_robot_race` | (kosong) | circle | on_color | #3FB6A0 | icon_large | 512 x 512 | 0.06 | 2 |
| `icon_practice` | (kosong) | circle | on_color | #3469C4 | icon_large | 512 x 512 | 0.06 | 2 |
| `game_orb_forge` | (kosong) | circle | on_color | #3469C4 | icon_large | 512 x 512 | 0.06 | 2 |
| `game_balloon_burst` | (kosong) | circle | on_color | #F2716B | icon_large | 512 x 512 | 0.06 | 2 |
| `game_factory_sort` | (kosong) | circle | on_color | #F9C74F | icon_large | 512 x 512 | 0.06 | 2 |
| `game_bridge_builder` | (kosong) | circle | on_color | #B198EA | icon_large | 512 x 512 | 0.06 | 2 |
| `game_balance_gate` | (kosong) | circle | on_color | #F2716B | icon_large | 512 x 512 | 0.06 | 2 |
| `game_measure_hunt` | (kosong) | circle | on_color | #B198EA | icon_large | 512 x 512 | 0.06 | 2 |
| `mission_place_value` | (kosong) | circle | on_color | #F2716B | icon_large | 512 x 512 | 0.06 | 2 |
| `mission_multiply_divide` | (kosong) | circle | on_color | #3469C4 | icon_large | 512 x 512 | 0.06 | 2 |
| `mission_fractions` | (kosong) | circle | on_color | #3FB6A0 | icon_large | 512 x 512 | 0.06 | 2 |
| `mission_decimals` | (kosong) | circle | on_color | #F9C74F | icon_large | 512 x 512 | 0.06 | 2 |
| `mission_measurement` | (kosong) | circle | on_color | #B198EA | icon_large | 512 x 512 | 0.06 | 2 |
