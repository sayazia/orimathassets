# Numeria Arena UI, batch U1: ringkasan

Dikerjakan 30 Sep 2026 atas permintaan Zia, mengikuti `docs/brief/BRIEF-UI-U1.md` dan `docs/brief/ATURAN-UMUM.md`.
Semua banner, tombol, kata HUD, lencana, dan ikon batch U1 dengan huruf kertas seperti stiker "BEGIN HERE",
ditambah satu set huruf kertas untuk teks dinamis (skor, jam, soal). Semuanya dibangun dari kode di `scripts/ui/`
tanpa font pihak ketiga, tanpa merek lain, dan tanpa emdash.

```
npm run build:ui            # semua berkas ui2d/, manifest, dan preview
npm run build:ui -- race_   # hanya berkas yang namanya diawali race_
npm run build:2d -- brand   # logo, ikon aplikasi, favicon, dan gambar promosi Numeria Arena
```

Buka `ui2d/preview.html`: setiap berkas E tampil di samping `2d/labels/label_begin_here.png` di atas empat latar uji (kertas buram DOF, krem #F6E3C0, teal #3FB6A0,
dan ruangan buram yang agak gelap), lalu semua berkas E pada ukuran di game (sekitar 2 cm dilihat dari 50 cm), atlas huruf, uji baca angka, dan satu contoh HUD lomba yang angkanya disusun
dari atlas huruf kertas.

## Perlakuan

| Kode | Manifest | Dipakai untuk | Cara dibuat |
|---|---|---|---|
| E | `emboss` | default: judul, menu, status, gelombang, kata HUD, petunjuk, tombol, jeda, semua ikon | stiker bening gaya D yang sama dengan `label_begin_here.png` (`scripts/2d/menu.mjs`): badan bening yang mengambil warna latar dengan kilap putih rata 0 sampai 4.2%; tepi kiri dan atas menghilang ke latar; garis mengelupas dan bayangan lembut (empat lapis, hitam 10 sampai 16%) hanya di kanan dan bawah; garis atas sangat samar 3.5%. Huruf kertas krem padat #FFF8EC dengan bayangan pendek lembut (geser 1.5/3 px, blur 2 px, hitam 20% pada tinggi huruf 72 px, diskalakan). Tanpa tepi terang atau gelap di sekeliling huruf dan tanpa bingkai timbul |
| W | `on_color` | warna yang bermakna: READY!, BOSS ROUND, DOUBLE POINTS!, TIME'S UP!, juara, nama pemain dan robot, gelembung robot, umpan balik, strip waktu, lencana | muka warna peran, huruf krem #FFF8EC dengan sisi gelap #F6E3C0, bayangan huruf 2 px warna latar digelapkan 20% |
| K | `solid_paper` | kartu soal dan tag jawaban | muka #FFFDF8 padat, kosong; game menulis dengan tinta |

Tombol (`button_*`) juga punya `_pressed` (stiker menempel rata: tanpa bayangan kelupas, bayangan huruf dipendekkan) dan
`_off` (bayangan setengah kekuatan, huruf 50% tembus pandang).

## Berkas

| Folder | Isi |
|---|---|
| `ui2d/font/` | `paper_glyphs_E.png`, `_W.png`, `_K.png` (atlas 1024 x 888, tinggi glyph 128 px), `paper_glyphs.json` (sel atlas, lebar maju, bearing kiri dan kanan, kerning per pasangan, lebar angka tabular), SVG per glyph di `glyphs/E/`, `glyphs/W/`, `glyphs/K/` (53 glyph termasuk spasi) |
| `ui2d/brand/`, `menu/`, `placement/`, `race/`, `question/`, `recap/`, `web/` | berkas P1 dan empat menu P3 |
| `ui2d/pause/`, `buttons/`, `icons/`, `icons_large/` | berkas P2 |
| `ui2d/manifest.json` | 167 entri (P1 66, P2 97, P3 4), format bagian 4 brief, ditambah `letter_px`, `slots`, dan `note` |
| `2d/brand/` | `logo_numeria_arena` (krem di atas teal) dan `logo_numeria_arena_emboss` (PNG lebar 1200), `app_icon`, `app_icon_maskable`, `favicon`, `devpost_thumbnail`, `social_preview`; `logo_foldlings*` dihapus |

Huruf kertas: A sampai Z, 0 sampai 9, `+ − - × ÷ = ? / . , : % ! ' ( ) ²` dan spasi. Minus (−) dan tanda hubung (-)
dibedakan: tanda hubung lebih pendek dan sedikit lebih rendah. Alias di JSON: `x` dan `*` menjadi `×`. Angka dibuat jelas
untuk anak: 1 punya bendera dan kaki (tidak mirip 7 atau I), 0 lebih sempit dari O (lebar maju 4.4 lawan 5.7 satuan),
6 berkait terbuka di atas sedangkan 9 bertangkai lurus, jadi keduanya bukan putaran satu sama lain. Bentuk huruf yang sudah
ada di stiker BEGIN HERE dipakai persis.

## Warna

Persis tabel 1.2: kertas #FFF8EC, kertas belakang #F6E3C0, tinta #3A3F4B, tinta soal #1F4FA3, coral #F2716B, cobalt #3469C4,
teal #3FB6A0, benar #5DB85B, coba lagi #F8961E, salah #E04A44, emas #E8B64C, perak #B8BEC8, perunggu #C98A5A, ungu boss
#6D597A. Sunflower dan violet tidak lagi dipakai karena menu kini E. Muka K #FFFDF8. DONE kini tombol E seperti tombol lain.

## Keputusan yang berbeda dari brief, dan alasannya

1. **E mengikuti koreksi Zia untuk bagian 1.1**: E adalah stiker bening gaya BEGIN HERE (gaya D), bukan emboss bertepi.
   Nilai manifest tetap `emboss` sesuai format bagian 4. Seperti BEGIN HERE, huruf krem paling jelas di latar berwarna dan
   ruangan, dan lebih samar di latar krem atau kertas terang; pratinjau ukuran game menunjukkan keduanya berdampingan.
2. **Angka dinamis di HUD disusun dengan atlas K (tinta)**, kata tetapnya (SOLVED, PTS) tetap E. Brief 1.1 menyebut K untuk
   angka yang harus selalu terbaca; contoh HUD di pratinjau memakai cara ini. Pilihan sebelumnya (kata XS bertinta)
   digantikan brief baru, jadi SOLVED, PTS, dan PROGRESS NOT SAVED kini E.
3. **Atlas E, W, K** menggantikan "dua versi T dan W" di 1.5, karena perlakuan T tidak ada lagi di 1.1. Atlas K dicetak
   tinta #3A3F4B; untuk teks soal game mewarnainya #1F4FA3.
4. **Bayangan stiker** memakai lapisan kelupas yang sama dengan label menu (`PEEL` di `scripts/ui/paper.mjs`), dengan tinggi
   angkat diskalakan dari ukuran bentuk. Untuk bentuk bukan persegi (lingkaran, jajar genjang, gelembung, pita) bayangan
   dibuat dari salinan bentuk yang digeser ke kanan bawah lalu dipudarkan ke atas dan ke kiri.
5. **Tinggi PNG**: persegi panjang dan jajar genjang tepat setinggi kelasnya. Lingkaran, gelembung, dan pita lebih tinggi
   karena bentuknya, sedangkan tinggi huruf tetap sesuai kelas; `world_height_m` diskalakan dengan tinggi PNG supaya huruf
   di dunia tetap berukuran kelasnya. Teks lingkaran dan gelembung dipatah ke dua baris bila lebih bulat (TIME'S / UP!).
6. **Slot angka** di `slots` manifest (x, y, w, h dalam px PNG) untuk berkas yang angkanya menyusul: `status_or_wait`
   (OR WAIT _ S), `hint_join_2_crystals`, `hint_make`, `feedback_points` (ruang untuk "+10"), `feedback_it_was`,
   `score_points`. Bentuk kosong (bingkai jam, tag, kartu) juga punya `slots` dengan teks yang muat (`0:00`, `000`).
7. **Ukuran bebas yang saya pilih**: kartu soal lebar muka 480, 800, 1120 px; tag jawaban muat tiga angka S, versi pecahan
   1.5x tinggi; strip waktu 640 x 22 px; `recap_place_*` lingkaran 440 px di kanvas 512 dengan huruf L; bingkai jam merah
   bertepi #E04A44 selebar 0.075 tinggi huruf.
8. **Pita (P)**: pada W, ekor belakang memakai warna latar digelapkan 10% dan lipatannya 20%. Pada E, pita dibuat satu pita
   stiker dengan ujung bertakik V, karena ekor belakang pada stiker bening hanya terlihat sebagai bayangan nyasar.
9. **Ikon tombol**: MENU memakai rumah, SKIP panah ganda dengan batang, RESUME segitiga play. Untuk tombol OFF ditambah ikon
   bercoret `music_off` dan `captions_off` (`sound_off` sudah ada di brief). Bendera balap di `icon_robot_race` memakai kotak
   krem dan kotak kosong, karena E tidak berwarna.
10. **Merek**: `logo_numeria_arena` tetap krem di atas teal supaya logo berdiri sendiri di mana pun (Devpost, ikon), ditambah
    versi `logo_numeria_arena_emboss`. Ikon aplikasi dan favicon kini monogram NA dan N; bangau dan buku Foldlings dilepas.
    `title_numeria_arena_w` dihapus karena brief baru hanya meminta versi E.
11. **Belum dikerjakan**: versi `_id` (bagian 2.11 masih berstatus usulan, menunggu persetujuan Zia).

## Daftar berkas

| Berkas | Teks | Bentuk | Perlakuan | Latar | Kelas | PNG (px) | Tinggi dunia (m) | P |
|---|---|---|---|---|---|---|---|---|
| `title_numeria_arena` | NUMERIA ARENA | rectangle | emboss | (latar di belakangnya) | XL | 2076 x 400 | 0.07 | 1 |
| `menu_robot_race` | ROBOT RACE | parallelogram | emboss | (latar di belakangnya) | S | 422 x 96 | 0.022 | 1 |
| `menu_balloon_burst` | BALLOON BURST | parallelogram | emboss | (latar di belakangnya) | S | 516 x 96 | 0.022 | 1 |
| `menu_orb_forge` | ORB FORGE | parallelogram | emboss | (latar di belakangnya) | S | 384 x 96 | 0.022 | 1 |
| `menu_factory_sort` | FACTORY SORT | parallelogram | emboss | (latar di belakangnya) | S | 484 x 96 | 0.022 | 3 |
| `menu_bridge_builder` | BRIDGE BUILDER | parallelogram | emboss | (latar di belakangnya) | S | 502 x 96 | 0.022 | 3 |
| `menu_balance_gate` | BALANCE GATE | parallelogram | emboss | (latar di belakangnya) | S | 482 x 96 | 0.022 | 3 |
| `menu_measure_hunt` | MEASURE HUNT | parallelogram | emboss | (latar di belakangnya) | S | 494 x 96 | 0.022 | 3 |
| `status_finding_table` | FINDING YOUR TABLE | rectangle | emboss | (latar di belakangnya) | M | 978 x 160 | 0.035 | 1 |
| `status_pinch_to_place` | PINCH TO PLACE THE BOOK | rectangle | emboss | (latar di belakangnya) | M | 1252 x 160 | 0.035 | 1 |
| `status_or_wait` | OR WAIT # S | rectangle | emboss | (latar di belakangnya) | S | 428 x 96 | 0.022 | 1 |
| `status_ready` | READY! | circle | on_color | #5DB85B | L | 640 x 644 | 0.1258 | 1 |
| `race_wave_1` | WAVE 1 OF 3 | rectangle | emboss | (latar di belakangnya) | L | 1104 x 256 | 0.05 | 1 |
| `race_wave_2` | WAVE 2 OF 3 | rectangle | emboss | (latar di belakangnya) | L | 1114 x 256 | 0.05 | 1 |
| `race_wave_3` | WAVE 3 OF 3 | rectangle | emboss | (latar di belakangnya) | L | 1114 x 256 | 0.05 | 1 |
| `race_boss_round` | BOSS ROUND | ribbon | on_color | #6D597A | L | 1338 x 302 | 0.059 | 1 |
| `race_double_points` | DOUBLE POINTS! | parallelogram | on_color | #E8B64C | M | 822 x 160 | 0.035 | 1 |
| `race_20_seconds` | 20 SECONDS | rectangle | emboss | (latar di belakangnya) | S | 386 x 96 | 0.022 | 1 |
| `race_times_up` | TIME'S UP! | circle | on_color | #E04A44 | L | 660 x 662 | 0.1293 | 1 |
| `race_clock_frame` | (kosong) | rectangle | emboss | (latar di belakangnya) | M | 310 x 160 | 0.035 | 1 |
| `race_clock_frame_red` | (kosong) | rectangle | emboss | (latar di belakangnya) | M | 310 x 160 | 0.035 | 1 |
| `race_place_1st` | 1ST | circle | on_color | #E8B64C | S | 156 x 156 | 0.0357 | 1 |
| `race_place_2nd` | 2ND | circle | on_color | #B8BEC8 | S | 164 x 164 | 0.0376 | 1 |
| `race_place_3rd` | 3RD | circle | on_color | #C98A5A | S | 164 x 164 | 0.0376 | 1 |
| `race_name_you` | YOU | rectangle | on_color | #F2716B | S | 176 x 96 | 0.022 | 1 |
| `race_name_clip` | CLIP (BOT) | rectangle | on_color | #3469C4 | S | 336 x 96 | 0.022 | 1 |
| `race_name_crease` | CREASE (BOT) | rectangle | on_color | #3FB6A0 | S | 430 x 96 | 0.022 | 1 |
| `race_word_solved` | SOLVED | rectangle | emboss | (latar di belakangnya) | XS | 182 x 64 | 0.016 | 1 |
| `race_word_pts` | PTS | rectangle | emboss | (latar di belakangnya) | XS | 116 x 64 | 0.016 | 1 |
| `robot_nice_cobalt` | NICE! | speech_bubble | on_color | #3469C4 | S | 190 x 176 | 0.0403 | 1 |
| `robot_nice_teal` | NICE! | speech_bubble | on_color | #3FB6A0 | S | 190 x 176 | 0.0403 | 1 |
| `robot_yay_cobalt` | YAY! | speech_bubble | on_color | #3469C4 | S | 184 x 170 | 0.039 | 1 |
| `robot_yay_teal` | YAY! | speech_bubble | on_color | #3FB6A0 | S | 184 x 170 | 0.039 | 1 |
| `robot_got_it_cobalt` | GOT IT! | speech_bubble | on_color | #3469C4 | S | 242 x 224 | 0.0513 | 1 |
| `robot_got_it_teal` | GOT IT! | speech_bubble | on_color | #3FB6A0 | S | 242 x 224 | 0.0513 | 1 |
| `card_question_short` | (kosong) | rectangle | solid_paper | #FFFDF8 | M | 510 x 160 | 0.035 | 1 |
| `card_question_medium` | (kosong) | rectangle | solid_paper | #FFFDF8 | M | 830 x 160 | 0.035 | 1 |
| `card_question_long` | (kosong) | rectangle | solid_paper | #FFFDF8 | M | 1150 x 160 | 0.035 | 1 |
| `hint_pop_right_answer` | POP THE RIGHT ANSWER | rectangle | emboss | (latar di belakangnya) | S | 694 x 96 | 0.022 | 1 |
| `hint_join_2_crystals` | JOIN 2 CRYSTALS TO MAKE | rectangle | emboss | (latar di belakangnya) | S | 862 x 96 | 0.022 | 1 |
| `hint_make` | MAKE | rectangle | emboss | (latar di belakangnya) | S | 306 x 96 | 0.022 | 1 |
| `feedback_points` | POINTS | parallelogram | on_color | #5DB85B | M | 656 x 160 | 0.035 | 1 |
| `feedback_try_again` | TRY AGAIN! | parallelogram | on_color | #F8961E | M | 624 x 160 | 0.035 | 1 |
| `feedback_it_was` | IT WAS | parallelogram | on_color | #F8961E | M | 654 x 160 | 0.035 | 1 |
| `feedback_missed` | MISSED | parallelogram | emboss | (latar di belakangnya) | S | 280 x 96 | 0.022 | 1 |
| `tag_answer_balloon` | (kosong) | rectangle | solid_paper | #FFFDF8 | S | 180 x 96 | 0.022 | 1 |
| `tag_answer_balloon_fraction` | (kosong) | rectangle | solid_paper | #FFFDF8 | S | 180 x 132 | 0.0303 | 1 |
| `tag_answer_crystal` | (kosong) | rectangle | solid_paper | #FFFDF8 | S | 180 x 96 | 0.022 | 1 |
| `tag_answer_crystal_fraction` | (kosong) | rectangle | solid_paper | #FFFDF8 | S | 180 x 132 | 0.0303 | 1 |
| `timer_strip_correct` | (kosong) | rectangle | on_color | #5DB85B | XS | 654 x 64 | 0.016 | 1 |
| `timer_strip_try_again` | (kosong) | rectangle | on_color | #F8961E | XS | 654 x 64 | 0.016 | 1 |
| `score_points` | POINTS | rectangle | emboss | (latar di belakangnya) | M | 614 x 160 | 0.035 | 1 |
| `recap_title` | RACE RESULTS | ribbon | emboss | (latar di belakangnya) | L | 1476 x 302 | 0.059 | 1 |
| `recap_place_1st` | 1ST | circle | on_color | #E8B64C | icon_large | 512 x 512 | 0.06 | 1 |
| `recap_place_2nd` | 2ND | circle | on_color | #B8BEC8 | icon_large | 512 x 512 | 0.06 | 1 |
| `recap_place_3rd` | 3RD | circle | on_color | #C98A5A | icon_large | 512 x 512 | 0.06 | 1 |
| `badge_label_best_comeback` | BEST COMEBACK | ribbon | on_color | #E8B64C | S | 592 x 112 | 0.0257 | 1 |
| `badge_label_most_improved` | MOST IMPROVED | ribbon | on_color | #E8B64C | S | 578 x 112 | 0.0257 | 1 |
| `badge_label_sharpest_aim` | SHARPEST AIM | ribbon | on_color | #E8B64C | S | 540 x 112 | 0.0257 | 1 |
| `badge_label_steady_streak` | STEADY STREAK | ribbon | on_color | #E8B64C | S | 584 x 112 | 0.0257 | 1 |
| `badge_label_brave_try` | BRAVE TRY | ribbon | on_color | #E8B64C | S | 456 x 112 | 0.0257 | 1 |
| `button_done` | DONE | rectangle | emboss | (latar di belakangnya) | M | 334 x 160 | 0.035 | 1 |
| `button_done_pressed` | DONE | rectangle | emboss | (latar di belakangnya) | M | 334 x 160 | 0.035 | 1 |
| `button_done_off` | DONE | rectangle | emboss | (latar di belakangnya) | M | 334 x 160 | 0.035 | 1 |
| `button_start` | START | rectangle | emboss | (latar di belakangnya) | M | 382 x 160 | 0.035 | 1 |
| `button_start_pressed` | START | rectangle | emboss | (latar di belakangnya) | M | 382 x 160 | 0.035 | 1 |
| `button_start_off` | START | rectangle | emboss | (latar di belakangnya) | M | 382 x 160 | 0.035 | 1 |
| `button_enter_xr` | ENTER XR | rectangle | emboss | (latar di belakangnya) | M | 520 x 160 | 0.035 | 1 |
| `button_enter_xr_pressed` | ENTER XR | rectangle | emboss | (latar di belakangnya) | M | 520 x 160 | 0.035 | 1 |
| `button_enter_xr_off` | ENTER XR | rectangle | emboss | (latar di belakangnya) | M | 520 x 160 | 0.035 | 1 |
| `pause_paused` | PAUSED | circle | emboss | (latar di belakangnya) | L | 690 x 692 | 0.1352 | 2 |
| `pause_welcome_back` | WELCOME BACK! | rectangle | emboss | (latar di belakangnya) | M | 796 x 160 | 0.035 | 2 |
| `notice_not_saved` | PROGRESS NOT SAVED ON THIS DEVICE | rectangle | emboss | (latar di belakangnya) | XS | 728 x 64 | 0.016 | 2 |
| `button_play` | PLAY | rectangle | emboss | (latar di belakangnya) | M | 430 x 160 | 0.035 | 2 |
| `button_play_pressed` | PLAY | rectangle | emboss | (latar di belakangnya) | M | 430 x 160 | 0.035 | 2 |
| `button_play_off` | PLAY | rectangle | emboss | (latar di belakangnya) | M | 430 x 160 | 0.035 | 2 |
| `button_play_again` | PLAY AGAIN | rectangle | emboss | (latar di belakangnya) | M | 712 x 160 | 0.035 | 2 |
| `button_play_again_pressed` | PLAY AGAIN | rectangle | emboss | (latar di belakangnya) | M | 712 x 160 | 0.035 | 2 |
| `button_play_again_off` | PLAY AGAIN | rectangle | emboss | (latar di belakangnya) | M | 712 x 160 | 0.035 | 2 |
| `button_next` | NEXT | rectangle | emboss | (latar di belakangnya) | M | 430 x 160 | 0.035 | 2 |
| `button_next_pressed` | NEXT | rectangle | emboss | (latar di belakangnya) | M | 430 x 160 | 0.035 | 2 |
| `button_next_off` | NEXT | rectangle | emboss | (latar di belakangnya) | M | 430 x 160 | 0.035 | 2 |
| `button_back` | BACK | rectangle | emboss | (latar di belakangnya) | M | 444 x 160 | 0.035 | 2 |
| `button_back_pressed` | BACK | rectangle | emboss | (latar di belakangnya) | M | 444 x 160 | 0.035 | 2 |
| `button_back_off` | BACK | rectangle | emboss | (latar di belakangnya) | M | 444 x 160 | 0.035 | 2 |
| `button_menu` | MENU | rectangle | emboss | (latar di belakangnya) | M | 442 x 160 | 0.035 | 2 |
| `button_menu_pressed` | MENU | rectangle | emboss | (latar di belakangnya) | M | 442 x 160 | 0.035 | 2 |
| `button_menu_off` | MENU | rectangle | emboss | (latar di belakangnya) | M | 442 x 160 | 0.035 | 2 |
| `button_resume` | RESUME | rectangle | emboss | (latar di belakangnya) | M | 550 x 160 | 0.035 | 2 |
| `button_resume_pressed` | RESUME | rectangle | emboss | (latar di belakangnya) | M | 550 x 160 | 0.035 | 2 |
| `button_resume_off` | RESUME | rectangle | emboss | (latar di belakangnya) | M | 550 x 160 | 0.035 | 2 |
| `button_settings` | SETTINGS | rectangle | emboss | (latar di belakangnya) | M | 604 x 160 | 0.035 | 2 |
| `button_settings_pressed` | SETTINGS | rectangle | emboss | (latar di belakangnya) | M | 604 x 160 | 0.035 | 2 |
| `button_settings_off` | SETTINGS | rectangle | emboss | (latar di belakangnya) | M | 604 x 160 | 0.035 | 2 |
| `button_skip` | SKIP | rectangle | emboss | (latar di belakangnya) | M | 400 x 160 | 0.035 | 2 |
| `button_skip_pressed` | SKIP | rectangle | emboss | (latar di belakangnya) | M | 400 x 160 | 0.035 | 2 |
| `button_skip_off` | SKIP | rectangle | emboss | (latar di belakangnya) | M | 400 x 160 | 0.035 | 2 |
| `button_yes` | YES | rectangle | emboss | (latar di belakangnya) | M | 380 x 160 | 0.035 | 2 |
| `button_yes_pressed` | YES | rectangle | emboss | (latar di belakangnya) | M | 380 x 160 | 0.035 | 2 |
| `button_yes_off` | YES | rectangle | emboss | (latar di belakangnya) | M | 380 x 160 | 0.035 | 2 |
| `button_no` | NO | rectangle | emboss | (latar di belakangnya) | M | 326 x 160 | 0.035 | 2 |
| `button_no_pressed` | NO | rectangle | emboss | (latar di belakangnya) | M | 326 x 160 | 0.035 | 2 |
| `button_no_off` | NO | rectangle | emboss | (latar di belakangnya) | M | 326 x 160 | 0.035 | 2 |
| `button_sound_on` | SOUND ON | rectangle | emboss | (latar di belakangnya) | M | 640 x 160 | 0.035 | 2 |
| `button_sound_on_pressed` | SOUND ON | rectangle | emboss | (latar di belakangnya) | M | 640 x 160 | 0.035 | 2 |
| `button_sound_on_off` | SOUND ON | rectangle | emboss | (latar di belakangnya) | M | 640 x 160 | 0.035 | 2 |
| `button_sound_off` | SOUND OFF | rectangle | emboss | (latar di belakangnya) | M | 686 x 160 | 0.035 | 2 |
| `button_sound_off_pressed` | SOUND OFF | rectangle | emboss | (latar di belakangnya) | M | 686 x 160 | 0.035 | 2 |
| `button_sound_off_off` | SOUND OFF | rectangle | emboss | (latar di belakangnya) | M | 686 x 160 | 0.035 | 2 |
| `button_music_on` | MUSIC ON | rectangle | emboss | (latar di belakangnya) | M | 610 x 160 | 0.035 | 2 |
| `button_music_on_pressed` | MUSIC ON | rectangle | emboss | (latar di belakangnya) | M | 610 x 160 | 0.035 | 2 |
| `button_music_on_off` | MUSIC ON | rectangle | emboss | (latar di belakangnya) | M | 610 x 160 | 0.035 | 2 |
| `button_music_off` | MUSIC OFF | rectangle | emboss | (latar di belakangnya) | M | 656 x 160 | 0.035 | 2 |
| `button_music_off_pressed` | MUSIC OFF | rectangle | emboss | (latar di belakangnya) | M | 656 x 160 | 0.035 | 2 |
| `button_music_off_off` | MUSIC OFF | rectangle | emboss | (latar di belakangnya) | M | 656 x 160 | 0.035 | 2 |
| `button_captions_on` | CAPTIONS ON | rectangle | emboss | (latar di belakangnya) | M | 766 x 160 | 0.035 | 2 |
| `button_captions_on_pressed` | CAPTIONS ON | rectangle | emboss | (latar di belakangnya) | M | 766 x 160 | 0.035 | 2 |
| `button_captions_on_off` | CAPTIONS ON | rectangle | emboss | (latar di belakangnya) | M | 766 x 160 | 0.035 | 2 |
| `button_captions_off` | CAPTIONS OFF | rectangle | emboss | (latar di belakangnya) | M | 812 x 160 | 0.035 | 2 |
| `button_captions_off_pressed` | CAPTIONS OFF | rectangle | emboss | (latar di belakangnya) | M | 812 x 160 | 0.035 | 2 |
| `button_captions_off_off` | CAPTIONS OFF | rectangle | emboss | (latar di belakangnya) | M | 812 x 160 | 0.035 | 2 |
| `button_language_en` | ENGLISH | rectangle | emboss | (latar di belakangnya) | M | 552 x 160 | 0.035 | 2 |
| `button_language_en_pressed` | ENGLISH | rectangle | emboss | (latar di belakangnya) | M | 552 x 160 | 0.035 | 2 |
| `button_language_en_off` | ENGLISH | rectangle | emboss | (latar di belakangnya) | M | 552 x 160 | 0.035 | 2 |
| `button_language_id` | BAHASA INDONESIA | rectangle | emboss | (latar di belakangnya) | M | 1020 x 160 | 0.035 | 2 |
| `button_language_id_pressed` | BAHASA INDONESIA | rectangle | emboss | (latar di belakangnya) | M | 1020 x 160 | 0.035 | 2 |
| `button_language_id_off` | BAHASA INDONESIA | rectangle | emboss | (latar di belakangnya) | M | 1020 x 160 | 0.035 | 2 |
| `icon_back` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_next` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_skip` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_home` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_replay` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_play` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_pause` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_settings` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_sound_on` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_sound_off` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_music` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_music_off` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_captions` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_captions_off` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_language` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_check` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_cross` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_close` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_star` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_clock` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_robot` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_you` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_trophy` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_lock` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_info` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_hand_poke` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_hand_pinch` | (kosong) | circle | emboss | (latar di belakangnya) | icon_small | 128 x 128 | 0.02 | 2 |
| `icon_robot_race` | (kosong) | circle | emboss | (latar di belakangnya) | icon_large | 512 x 512 | 0.06 | 2 |
| `icon_practice` | (kosong) | circle | emboss | (latar di belakangnya) | icon_large | 512 x 512 | 0.06 | 2 |
| `game_orb_forge` | (kosong) | circle | emboss | (latar di belakangnya) | icon_large | 512 x 512 | 0.06 | 2 |
| `game_balloon_burst` | (kosong) | circle | emboss | (latar di belakangnya) | icon_large | 512 x 512 | 0.06 | 2 |
| `game_factory_sort` | (kosong) | circle | emboss | (latar di belakangnya) | icon_large | 512 x 512 | 0.06 | 2 |
| `game_bridge_builder` | (kosong) | circle | emboss | (latar di belakangnya) | icon_large | 512 x 512 | 0.06 | 2 |
| `game_balance_gate` | (kosong) | circle | emboss | (latar di belakangnya) | icon_large | 512 x 512 | 0.06 | 2 |
| `game_measure_hunt` | (kosong) | circle | emboss | (latar di belakangnya) | icon_large | 512 x 512 | 0.06 | 2 |
| `mission_place_value` | (kosong) | circle | emboss | (latar di belakangnya) | icon_large | 512 x 512 | 0.06 | 2 |
| `mission_multiply_divide` | (kosong) | circle | emboss | (latar di belakangnya) | icon_large | 512 x 512 | 0.06 | 2 |
| `mission_fractions` | (kosong) | circle | emboss | (latar di belakangnya) | icon_large | 512 x 512 | 0.06 | 2 |
| `mission_decimals` | (kosong) | circle | emboss | (latar di belakangnya) | icon_large | 512 x 512 | 0.06 | 2 |
| `mission_measurement` | (kosong) | circle | emboss | (latar di belakangnya) | icon_large | 512 x 512 | 0.06 | 2 |
