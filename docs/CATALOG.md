# Katalog Aset Kota Origami

Rencana lengkap semua aset: kategori, nama file, ukuran grid, dan urutan pembuatan.
Status: ✅ selesai · ⬜ direncanakan. Total saat ini: 199 aset.

## Aturan umum

- **Satuan:** 1 unit = 1 petak grid. Ukuran ditulis `lebar×dalam` dalam petak (x×z).
- **Posisi:** model berada di tengah titik (0,0), sumbu y ke atas, tanah di y = 0.
  Model 2×1 membentang x −1..1 dan z −0.5..0.5.
- **Arah depan:** bangunan menghadap +z. Putar kelipatan 90° untuk menghadap jalan.
- **Petak tanah:** bangunan dan area punya alas kertas setebal 0.04. Objek (orang, mobil, pohon, perabot) tanpa alas.
- **Nama file:** `models/<kategori>/<grup>_<nama>.glb`, huruf kecil dengan garis bawah (bahasa Inggris, supaya aman dipakai di engine mana pun).
- **Warna:** semua dari satu palet (`scripts/lib/palette.mjs`).
- **Skala orang:** tinggi orang ±0.09 unit, pintu ±0.18, satu lantai ±0.2.

## A. Bangunan (`models/buildings/`)

### A1. Rumah — 20 jenis, dari kecil sampai mewah

| # | File | Nama | Ukuran | Status |
|---|---|---|---|---|
| 1 | house_hut | Gubuk kecil beratap jerami | 1×1 | ✅ |
| 2 | house_stilt | Rumah kayu panggung | 1×1 | ✅ |
| 3 | house_cottage | Rumah mungil berpagar | 1×1 | ✅ |
| 4 | house_basic | Rumah sederhana | 1×1 | ✅ |
| 5 | house_minimalist | Rumah minimalis atap datar | 1×1 | ✅ |
| 6 | house_row | Rumah deret (3 unit) | 1×1 | ✅ |
| 7 | house_garage | Rumah dengan garasi | 1×1 | ✅ |
| 8 | house_two_storey | Rumah dua lantai | 1×1 | ✅ |
| 9 | house_joglo | Rumah joglo (Jawa) | 1×1 | ✅ |
| 10 | house_gadang | Rumah gadang (Minang) | 1×1 | ✅ |
| 11 | house_colonial | Rumah kolonial berpilar | 1×1 | ✅ |
| 12 | house_bungalow | Bungalow beranda | 1×1 | ✅ |
| 13 | house_modern_glass | Rumah modern kaca | 1×1 | ✅ |
| 14 | house_garden | Rumah dengan kebun | 1×1 | ✅ |
| 15 | house_duplex | Rumah kopel (duplex) | 2×1 | ✅ |
| 16 | house_apartment | Apartemen kecil 4 lantai | 1×1 | ✅ |
| 17 | house_flats | Rumah susun tinggi | 1×1 | ✅ |
| 18 | house_villa_pool | Villa dengan kolam renang | 2×1 | ✅ |
| 19 | house_luxury | Rumah mewah modern | 2×2 | ✅ |
| 20 | house_mansion | Mansion / istana | 2×2 | ✅ |

### A2. Kantor — 10 jenis

| # | File | Nama | Ukuran | Status |
|---|---|---|---|---|
| 1 | office_shophouse | Ruko 3 lantai | 1×1 | ✅ |
| 2 | office_small | Kantor kecil 2 lantai | 1×1 | ✅ |
| 3 | office_glass_tower | Menara kaca | 1×1 | ✅ |
| 4 | office_stepped | Menara bertingkat mundur | 1×1 | ✅ |
| 5 | office_round | Menara silinder | 1×1 | ✅ |
| 6 | office_twin | Menara kembar | 2×1 | ✅ |
| 7 | office_helipad | Kantor pusat dengan helipad | 1×1 | ✅ |
| 8 | office_spire | Pencakar langit berpuncak runcing | 1×1 | ✅ |
| 9 | office_campus | Kampus bisnis rendah | 2×1 | ✅ |
| 10 | office_creative | Kantor kreatif kotak warna-warni | 1×1 | ✅ |

### A3. Layanan publik

| File | Nama | Ukuran | Status |
|---|---|---|---|
| public_school | Sekolah | 1×1 | ✅ |
| public_kindergarten | TK | 1×1 | ✅ |
| public_university | Universitas | 2×2 | ✅ |
| public_hospital | Rumah sakit | 2×1 | ✅ |
| public_clinic | Puskesmas | 1×1 | ✅ |
| public_police | Kantor polisi | 1×1 | ✅ |
| public_fire_station | Pemadam kebakaran | 1×1 | ✅ |
| public_post_office | Kantor pos | 1×1 | ✅ |
| public_city_hall | Balai kota | 2×1 | ✅ |
| public_library | Perpustakaan | 1×1 | ✅ |
| public_museum | Museum | 2×1 | ✅ |
| public_mosque | Masjid | 1×1 | ✅ |
| public_church | Gereja | 1×1 | ✅ |
| public_temple | Pura / vihara | 1×1 | ✅ |
| public_train_station | Stasiun kereta | 2×1 | ✅ |
| public_bus_terminal | Terminal bus | 2×1 | ✅ |
| public_airport | Terminal bandara | 2×2 | ✅ |
| public_water_tower | Menara air | 1×1 | ✅ |
| public_power_plant | Pembangkit listrik | 2×2 | ✅ |

### A4. Komersial

| File | Nama | Ukuran | Status |
|---|---|---|---|
| shop_general | Toko | 1×1 | ✅ |
| shop_minimarket | Minimarket | 1×1 | ✅ |
| shop_cafe | Kafe | 1×1 | ✅ |
| shop_restaurant | Restoran | 1×1 | ✅ |
| shop_market | Pasar tradisional | 2×1 | ✅ |
| shop_mall | Mal | 2×2 | ✅ |
| shop_hotel | Hotel | 1×1 | ✅ |
| shop_cinema | Bioskop | 1×1 | ✅ |
| shop_bank | Bank | 1×1 | ✅ |
| shop_gas_station | SPBU | 1×1 | ✅ |

### A5. Industri

| File | Nama | Ukuran | Status |
|---|---|---|---|
| industry_factory | Pabrik | 2×2 | ✅ |
| industry_warehouse | Gudang | 2×1 | ✅ |
| industry_silo | Silo | 1×1 | ✅ |

## B. Area (`models/areas/`)

### B1. Jalan — dari jalan setapak sampai jalan tol

Setiap jenis jalan punya potongan yang saling menyambung: lurus, belok, pertigaan, perempatan.

| Grup | Potongan | Status |
|---|---|---|
| path_ (jalan setapak) | straight, corner, t, cross | ✅ |
| road_dirt_ (jalan tanah desa) | straight, corner | ✅ |
| road_ (jalan kota 2 lajur) | straight, corner, t, cross | ✅ |
| road_ tambahan | crosswalk, end (buntu), roundabout (bundaran) | ✅ |
| avenue_ (jalan 4 lajur bermedian) | straight, corner, t, cross | ✅ |
| highway_ (jalan tol layang) | straight, corner, ramp (naik dari tanah), over_road (melintas di atas jalan biasa) | ✅ |
| bridge_ | bridge_road (jembatan di atas sungai) | ✅ |
| rail_ (rel kereta) | straight, corner, crossing (perlintasan) | ✅ |
| parking_ | parking_lot (parkiran) | ✅ |

### B2. Taman

| File | Nama | Status |
|---|---|---|
| park_fountain | Taman air mancur | ✅ |
| park_statue | Taman patung | ✅ |
| park_flower | Taman bunga | ✅ |
| park_playground | Taman bermain anak | ✅ |
| park_pond | Taman kolam | ✅ |
| park_zen | Taman batu / zen | ✅ |
| park_square | Alun-alun (2×2) | ✅ |
| park_community_garden | Kebun warga | ✅ |
| park_picnic | Taman piknik | ✅ |

### B3. Lapangan olahraga

| File | Nama | Ukuran | Status |
|---|---|---|---|
| sport_soccer | Lapangan sepak bola | 2×1 | ✅ |
| sport_basketball | Lapangan basket | 1×1 | ✅ |
| sport_tennis | Lapangan tenis | 1×1 | ✅ |
| sport_badminton | Lapangan bulu tangkis | 1×1 | ✅ |
| sport_pool | Kolam renang umum | 1×1 | ✅ |
| sport_skatepark | Skatepark | 1×1 | ✅ |
| sport_stadium | Stadion | 2×2 | ✅ |

### B4. Kebun binatang

| File | Nama | Ukuran | Status |
|---|---|---|---|
| zoo_gate | Gerbang masuk | 1×1 | ✅ |
| zoo_elephant | Kandang gajah | 1×1 | ✅ |
| zoo_giraffe | Kandang jerapah | 1×1 | ✅ |
| zoo_lion | Kandang singa | 1×1 | ✅ |
| zoo_penguin | Kolam penguin | 1×1 | ✅ |
| zoo_monkey | Pulau monyet | 1×1 | ✅ |
| zoo_aviary | Kandang burung | 1×1 | ✅ |

### B5. Alam

| File | Nama | Status |
|---|---|---|
| nature_grass | Rumput | ✅ |
| nature_forest | Hutan kecil | ✅ |
| nature_rice_field | Sawah | ✅ |
| nature_beach | Pantai | ✅ |
| nature_river_straight / nature_river_corner | Sungai | ✅ |
| nature_hill | Bukit | ✅ |

## C. Objek (`models/objects/`, tanpa alas, skala sama dengan bangunan)

| Grup | Isi | Status |
|---|---|---|
| people_ | pria, wanita, berhijab, pekerja kantor, pelajar, anak dengan balon, lansia, pelari, polisi, pekerja proyek, dokter, pesepeda, pedagang gerobak, orang berpayung, orang duduk | ✅ |
| vehicle_ | sedan, hatchback, taksi, SUV, pikap, van, mobil polisi, ambulans, pemadam kebakaran, bus kota, bus sekolah, truk, motor, sepeda, bajaj, becak, lokomotif, gerbong kereta | ✅ |
| tree_ / plant_ | pohon bulat, pinus, palem, kelapa, sakura, cemara, beringin, akasia, bambu, semak, semak berbunga, pagar tanaman, kaktus, pot bunga, bedeng bunga | ✅ |
| prop_ | lampu jalan, bangku, tempat sampah, halte, lampu lalu lintas, rambu stop, rambu peringatan, papan penunjuk arah, hidran, kotak pos, telepon umum, mesin minuman, air mancur kecil, patung, pagar, tiang bendera, meja kafe, payung pantai | ✅ |
| billboard_ | papan reklame tiang tinggi, baliho lebar, papan digital, papan atap gedung, papan berdiri (A-frame) | ✅ |
| animal_ | gajah, jerapah, singa, singa betina, zebra, penguin, monyet, sapi, kucing, burung | ✅ |

## Urutan pembuatan

1. **Batch 1:** 20 rumah
2. **Batch 2:** 10 kantor dan bangunan komersial
3. **Batch 3:** layanan publik dan industri
4. **Batch 4:** semua jenis jalan dan rel
5. **Batch 5:** taman dan lapangan olahraga
6. **Batch 6:** kebun binatang, hewan, alam
7. **Batch 7:** orang, kendaraan, tanaman, perabot jalan, papan reklame

Setiap batch menghasilkan file GLB, gambar pratinjau per aset, dan satu lembar kontak per kategori di `previews/`.

---

# Aset Game Foldlings

Aset untuk Foldlings, game matematika mixed reality (WebXR, Meta Quest) untuk anak kelas 4 sampai 6.
Konvensi teknis lengkap ada di [`FOLDLINGS.md`](FOLDLINGS.md). Ringkasnya: satuan **meter**, y ke atas,
depan +Z, dasar di y = 0, maksimal 6 material per aset, node dan anchor bernama tetap, klip animasi
transformasi saja, validator glTF 0 error 0 warning.

Status: ✅ selesai · 🟡 sebagian · ⬜ direncanakan.

| Batch | Isi | Status |
|---|---|---|
| B1 | 8 Foldlings (6 varian warna), burung kertas, bendera, buku pop-up terbuka dan tertutup, bingkai pop-up | ✅ |
| B2 | Perlengkapan 6 jenis game (Orb Forge, Balloon Burst, Factory Sort, Bridge Builder, Balance Gate, Measure Hunt) | ✅ |
| B3 | Model bantuan visual (basis 10, garis bilangan, strip, petak luas, irisan pie) | ⬜ |
| B4 | Portal | ⬜ |
| B5 | Karakter (Pip, The Great Crumple, 3 robot partner) | ⬜ |
| B6 | Fold Town: bangunan skill 3 tingkat dan alas halaman kota | ⬜ |
| B7 | Hadiah dan UI 3D | ⬜ |
| B8 | Efek | ⬜ |
| 2D | Avatar, kata sandi gambar, logo, ikon, thumbnail | ⬜ |

## B1. Foldlings, burung kertas, dan buku ✅

Segitiga = geometri utama; "+garis" = segitiga `ink_outline` (opsional, bisa dimatikan game).
Ukuran = kotak batas nyata (x × z × y, meter). Semua lolos validator (0 error, 0 warning).

| File | Segitiga | +garis | KB | Ukuran (x×z×y) | Anchor | Klip |
|---|---|---|---|---|---|---|
| foldlings/foldling_fox | 280 | 234 | 52.0 | 0.077×0.023×0.059 | flag_anchor, label_anchor | idle, hop, cheer, bounce, fold |
| foldlings/foldling_rabbit | 376 | 332 | 56.9 | 0.052×0.032×0.070 | flag_anchor, label_anchor | idle, hop, cheer, bounce, fold |
| foldlings/foldling_crane | 136 | 96 | 32.8 | 0.072×0.071×0.055 | flag_anchor, label_anchor | idle, hop, cheer, bounce, fold |
| foldlings/foldling_turtle | 178 | 138 | 35.1 | 0.076×0.052×0.028 | flag_anchor, label_anchor | idle, hop, cheer, bounce, fold |
| foldlings/foldling_frog | 236 | 196 | 32.6 | 0.043×0.048×0.032 | flag_anchor, label_anchor | idle, hop, cheer, bounce, fold |
| foldlings/foldling_fish | 122 | 82 | 27.6 | 0.069×0.029×0.036 | flag_anchor, label_anchor | idle, hop, cheer, bounce, fold |
| foldlings/foldling_cat | 232 | 188 | 41.8 | 0.045×0.026×0.065 | flag_anchor, label_anchor | idle, hop, cheer, bounce, fold |
| foldlings/foldling_elephant | 310 | 270 | 52.2 | 0.077×0.044×0.055 | flag_anchor, label_anchor | idle, hop, cheer, bounce, fold |
| foldlings/paper_bird | 90 | 50 | 15.5 | 0.060×0.070×0.012 | (tidak ada) | flap (0.4 s) |
| foldlings/flag_small | 60 | 60 | 8.6 | 0.054×0.004×0.093 | label_anchor | wave |
| book/popup_book | 380 | 284 | 32.4 | 0.360×0.240×0.025 | spawn_anchor, exit_anchor, town_origin | |
| book/popup_book_closed | 184 | 184 | 17.9 | 0.182×0.240×0.033 | | |
| book/page_popup_frame | 164 | 164 | 16.6 | 0.298×0.019×0.118 | | |

Varian warna: setiap Foldling dan `paper_bird` punya 6 berkas: berkas dasar = `place_value` (coral),
lalu `_multiply_divide` (cobalt), `_fractions` (teal), `_decimals` (sunflower), `_measurement` (violet),
`_rare` (gold dengan tepi paper). Total B1: 13 aset, 58 berkas GLB.

Pratinjau: `previews/foldlings/`, `previews/book/` (depan, tiga perempat, samping, siluet),
`previews/sheet_foldlings.png`, `sheet_foldlings_variants.png`, `sheet_book.png`,
`previews/clips/` (6 frame per klip), `previews/cvd_foldlings.png` (simulasi buta warna),
`previews/table_b1_wood.png` dan `table_b1_white.png` (skala meja dari mata anak duduk).

### Keputusan yang berbeda dari brief

1. **Warna misi `multiply_divide` dan `measurement`.** `blue` dan `purple` dari palet kota hampir sama
   bagi penderita protanopia (ΔE 5.7) dan deuteranopia (ΔE 8.1). Ditambah dua warna baru tanpa mengubah
   warna kota: `cobalt` #3469C4 (lebih gelap) dan `violet` #B198EA (lebih terang). Jarak terkecil antar
   warna misi kini ΔE 17 (coral dan teal pada protanopia, beda terang-gelap), selebihnya di atas 20.
   Rinciannya di `FOLDLINGS.md`.
2. **Varian sebagai berkas terpisah**, bukan ganti material saat runtime. Nama material tetap kunci palet,
   jadi game masih bisa mengganti warna sendiri bila mau. Dicatat di manifest (`variant_files`, `variant_colours`).
3. **Arah makhluk.** Profil makhluk menghadap pemain (+Z) dan kepala ke +X, sesuai ukuran brief yang
   panjangnya di sumbu x. `hop` diputar di tempat; game menggeser root 0.03 m ke +X selama klip.
4. **Segitiga di bawah batas bawah** untuk bangau (136), ikan (122), kura-kura (178), katak (236), kucing (232),
   rubah (280) dan gajah (310). Bentuk origami aslinya memang sederhana; menambah segi hanya supaya angka
   naik akan membuat lipatan kurang rapi (brief: pilih lebih rapi). Kelinci (376) sudah di dalam rentang.
5. **Status tersembunyi** (`eyes_happy`) memakai skala 0 plus `extras.hidden_by_default`, karena glTF tidak
   punya flag visibilitas yang umum. Game menampilkannya dengan skala 1.
6. **`ink_outline`** ada di setiap bagian bergerak sebagai anak node. three.js mengganti nama duplikat menjadi
   `ink_outline_1`, dan seterusnya, jadi cari dengan awalan `ink_outline`.
7. **Pratinjau meja** memakai permukaan meja kayu dan putih yang digambar dari kode, bukan foto, supaya tidak
   ada gambar pihak ketiga.
8. **Burung kertas** berorigin di pusat badan (selalu terbang), bukan di meja.

## B2. Perlengkapan enam jenis game ✅

Folder `models/game/<grup>/`. Kolom: segitiga, +garis tinta, KB, ukuran nyata (x×z×y, m), anchor, node bagian.
Semua lolos validator (0 error, 0 warning). Total B2: 30 aset, 33 berkas GLB.

| File | Segitiga | +garis | KB | Ukuran | Anchor | Bagian |
|---|---|---|---|---|---|---|
| game/orb_forge/crystal | 48 | 48 | 6.4 | 0.035×0.035×0.050 | label_anchor, hand_anchor | gem |
| game/orb_forge/orb | 174 | 174 | 16.4 | 0.054×0.054×0.054 | label_anchor, hand_anchor | core |
| game/orb_forge/crystal_tray | 200 | 200 | 15.3 | 0.464×0.074×0.015 | slot_0, slot_1, slot_2, slot_3, slot_4 | tray |
| game/orb_forge/shield_badge | 52 | 52 | 6.6 | 0.050×0.010×0.060 | label_anchor | badge |
| game/balloon/balloon_round | 104 | 104 | 12.7 | 0.064×0.064×0.120 | label_anchor | skin, knot, string |
| game/balloon/balloon_long | 104 | 104 | 12.7 | 0.043×0.043×0.130 | label_anchor | skin, knot, string |
| game/balloon/balloon_heart | 154 | 154 | 17.0 | 0.065×0.033×0.115 | label_anchor | skin, knot, string |
| game/balloon/balloon_pop_pieces | 64 | 64 | 15.9 | 0.073×0.076×0.033 |  | piece_0, piece_1, piece_2, piece_3, piece_4, piece_5, piece_6, piece_7 |
| game/factory/conveyor_straight | 148 | 148 | 14.2 | 0.120×0.064×0.031 |  | frame, belt |
| game/factory/conveyor_start | 144 | 144 | 12.8 | 0.080×0.064×0.050 | spawn_anchor | frame |
| game/factory/sort_gate (+2 varian) | 88 | 88 | 11.0 | 0.064×0.064×0.121 | label_anchor | arch, sign, chute |
| game/factory/sort_bin | 60 | 60 | 5.7 | 0.084×0.063×0.040 | drop_anchor | bin |
| game/factory/item_token | 68 | 68 | 7.4 | 0.040×0.040×0.021 | label_anchor, hand_anchor | token |
| game/bridge/gap_cliffs | 56 | 56 | 9.1 | 0.400×0.100×0.060 | socket_plank_start, socket_plank_end | cliff_right, cliff_left |
| game/bridge/plank_1 | 40 | 0 | 4.1 | 0.240×0.040×0.006 | label_anchor, hand_anchor | plank |
| game/bridge/plank_1_2 | 40 | 0 | 4.1 | 0.120×0.040×0.006 | label_anchor, hand_anchor | plank |
| game/bridge/plank_1_3 | 40 | 0 | 4.1 | 0.080×0.040×0.006 | label_anchor, hand_anchor | plank |
| game/bridge/plank_1_4 | 40 | 0 | 4.1 | 0.060×0.040×0.006 | label_anchor, hand_anchor | plank |
| game/bridge/plank_1_5 | 40 | 0 | 4.1 | 0.048×0.040×0.006 | label_anchor, hand_anchor | plank |
| game/bridge/plank_1_6 | 40 | 0 | 4.1 | 0.040×0.040×0.006 | label_anchor, hand_anchor | plank |
| game/bridge/plank_1_8 | 40 | 0 | 4.1 | 0.030×0.040×0.006 | label_anchor, hand_anchor | plank |
| game/bridge/plank_1_10 | 40 | 0 | 4.1 | 0.024×0.040×0.006 | label_anchor, hand_anchor | plank |
| game/bridge/bridge_post | 56 | 56 | 6.4 | 0.015×0.015×0.050 |  | post |
| game/balance/scale | 234 | 234 | 23.7 | 0.295×0.080×0.142 | socket_right_pan, label_anchor_right, socket_left_pan, label_anchor_left | base, pillar, beam, pan_right, pan_left |
| game/balance/weight_block | 40 | 40 | 5.1 | 0.035×0.036×0.030 | label_anchor, hand_anchor | block |
| game/balance/gate | 120 | 120 | 14.7 | 0.140×0.033×0.140 | exit_anchor | frame, door_right, door_left |
| game/measure/tape_measure | 300 | 72 | 22.4 | 0.073×0.050×0.021 | hand_anchor | housing, tape, tape_end |
| game/measure/ruler_30 | 500 | 12 | 31.8 | 0.310×0.030×0.004 |  | ruler |
| game/measure/marker_pin (+1 varian) | 90 | 96 | 9.7 | 0.018×0.018×0.051 | hand_anchor | pin |
| game/measure/treasure_chest | 108 | 108 | 11.8 | 0.070×0.053×0.049 | reward_anchor | chest, lid |

Pratinjau: `previews/game/<grup>/`, `previews/sheet_{orb_forge,balloon,factory,bridge,balance,measure}.png`,
`previews/table_b2_{wood,white}.png` dan `previews/table_b2_factory_{wood,white}.png`.

### Keputusan yang berbeda dari brief

1. **Penggaris 30 cm** berukuran fisik 0.31 m supaya skala 0 sampai 30 cm muat dengan tepi 5 mm (penggaris
   sungguhan juga begitu). Garis setiap 5 mm, lebih panjang di tiap cm dan 5 cm. **Garis mm tidak dibuat**:
   lebarnya pasti di bawah batas minimum 2 mm dan akan berkedip di Quest. Segitiganya 500 (di atas 200)
   karena 61 tanda garis; tanda dibuat sebagai punggung segitiga untuk menghemat.
2. **Pita ukur** dimodelkan 1 m pada skala x = 1, dengan skala diam 0.02 (terlihat 2 cm). Tanda setiap 5 cm
   (lebih panjang di 10 cm), tanpa angka. Game menggeser `tape_end` ke x = 0.025 + 1.0 × skala.
3. **Papan jembatan** tanpa garis tinta supaya panjangnya terbaca tepat (selisih 0 mm di geometri). Tanda
   ruas lipat berupa lipatan tengah dan dua garis lipat di ujung, tanpa angka.
4. **Gerbang sortir** 1 sampai 3 berupa berkas varian (`sort_gate`, `sort_gate_2`, `sort_gate_3`) dalam coral,
   cobalt, sunflower. Papan label menghadap pemain (+Z); gerbang melintang di atas ban berjalan.
5. **Pin penanda** A (coral, berkas dasar) dan B (cobalt, `marker_pin_b`).
6. **Kristal dan balon** memakai warna netral (lavender, sky) yang diganti game lewat nama material.
7. Beberapa benda kecil (kristal 48, token 68, papan 40) di dekat batas bawah 40 segitiga: bentuknya memang sederhana.
