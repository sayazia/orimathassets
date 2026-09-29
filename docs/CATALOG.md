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
| B3 | Model bantuan visual (basis 10, garis bilangan, strip, petak luas, irisan pie) | ✅ |
| B4 | Portal | ✅ |
| B5 | Karakter (Pip, The Great Crumple, 3 robot partner) | ✅ |
| B6 | Fold Town: bangunan skill 3 tingkat dan alas halaman kota | ✅ |
| B7 | Hadiah dan UI 3D | ✅ |
| B8 | Efek | ✅ |
| 2D | Avatar, kata sandi gambar, logo, ikon, thumbnail | ✅ |

## B1. Foldlings, burung kertas, dan buku ✅

Segitiga = geometri utama; "+garis" = segitiga `ink_outline`. Sejak 29 September 2026 garis tinta dimatikan (0) atas
masukan bahwa garis tebal gelap membuat aset tidak terasa seperti kertas; lipatan kini dibaca dari sisi terang dan
sisi `_shade` (sekitar 11% lebih gelap, supaya tidak ada sisi yang tampak hitam). Detail kecil seperti mata, hidung,
pupil, dan kacamata dibuat sebagai lingkaran polos, bukan bentuk lipatan. `FOLDLINGS_OUTLINES=1 npm run build` bisa menyalakannya lagi.
Ukuran = kotak batas nyata (x × z × y, meter). Semua lolos validator (0 error, 0 warning).

| File | Segitiga | +garis | KB | Ukuran (x×z×y) | Anchor | Klip |
|---|---|---|---|---|---|---|
| foldlings/foldling_fox | 412 | 0 | 53.2 | 0.079×0.023×0.058 | flag_anchor, label_anchor | idle, hop, cheer, bounce, fold |
| foldlings/foldling_rabbit | 446 | 0 | 53.0 | 0.053×0.030×0.072 | flag_anchor, label_anchor | idle, hop, cheer, bounce, fold |
| foldlings/foldling_crane | 232 | 0 | 38.5 | 0.072×0.071×0.055 | flag_anchor, label_anchor | idle, hop, cheer, bounce, fold |
| foldlings/foldling_turtle | 260 | 0 | 38.6 | 0.077×0.052×0.028 | flag_anchor, label_anchor | idle, hop, cheer, bounce, fold |
| foldlings/foldling_frog | 424 | 0 | 43.8 | 0.043×0.048×0.032 | flag_anchor, label_anchor | idle, hop, cheer, bounce, fold |
| foldlings/foldling_fish | 218 | 0 | 34.2 | 0.069×0.029×0.036 | flag_anchor, label_anchor | idle, hop, cheer, bounce, fold |
| foldlings/foldling_cat | 370 | 0 | 45.1 | 0.047×0.025×0.066 | flag_anchor, label_anchor | idle, hop, cheer, bounce, fold |
| foldlings/foldling_elephant | 390 | 0 | 51.4 | 0.077×0.040×0.058 | flag_anchor, label_anchor | idle, hop, cheer, bounce, fold |
| foldlings/paper_bird | 186 | 0 | 23.0 | 0.060×0.070×0.012 | (tidak ada) | flap (0.4 s) |
| foldlings/flag_small | 96 | 0 | 9.6 | 0.054×0.005×0.093 | label_anchor | wave |
| book/popup_book | 380 | 0 | 26.4 | 0.360×0.240×0.025 | spawn_anchor, exit_anchor, town_origin | |
| book/popup_book_closed | 184 | 0 | 14.0 | 0.182×0.240×0.033 | | |
| book/page_popup_frame | 164 | 0 | 12.9 | 0.298×0.019×0.118 | | |

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
6. **`ink_outline`** tidak disertakan lagi (lihat catatan di atas). Jika dibangun ulang dengan garis, node itu menjadi
   anak setiap bagian; three.js mengganti nama duplikat menjadi `ink_outline_1` dan seterusnya.
7. **Pratinjau meja** memakai permukaan meja kayu dan putih yang digambar dari kode, bukan foto, supaya tidak
   ada gambar pihak ketiga.
8. **Burung kertas** berorigin di pusat badan (selalu terbang), bukan di meja.

## B2. Perlengkapan enam jenis game ✅

Folder `models/game/<grup>/`. Kolom: segitiga, +garis tinta, KB, ukuran nyata (x×z×y, m), anchor, node bagian.
Semua lolos validator (0 error, 0 warning). Total B2: 30 aset, 33 berkas GLB.

| File | Segitiga | +garis | KB | Ukuran | Anchor | Bagian |
|---|---|---|---|---|---|---|
| game/orb_forge/crystal | 48 | 0 | 5.2 | 0.035×0.035×0.050 | label_anchor, hand_anchor | gem |
| game/orb_forge/orb | 174 | 0 | 13.6 | 0.054×0.054×0.054 | label_anchor, hand_anchor | core |
| game/orb_forge/crystal_tray | 200 | 0 | 12.2 | 0.464×0.074×0.015 | slot_0, slot_1, slot_2, slot_3, slot_4 | tray |
| game/orb_forge/shield_badge | 52 | 0 | 5.3 | 0.050×0.010×0.060 | label_anchor | badge |
| game/balloon/balloon_round | 104 | 0 | 10.0 | 0.064×0.064×0.120 | label_anchor | skin, knot, string |
| game/balloon/balloon_long | 104 | 0 | 10.0 | 0.043×0.043×0.130 | label_anchor | skin, knot, string |
| game/balloon/balloon_heart | 154 | 0 | 13.7 | 0.065×0.033×0.115 | label_anchor | skin, knot, string |
| game/balloon/balloon_pop_pieces | 64 | 0 | 11.5 | 0.073×0.076×0.033 |  | piece_0, piece_1, piece_2, piece_3, piece_4, piece_5, piece_6, piece_7 |
| game/factory/conveyor_straight | 148 | 0 | 11.2 | 0.120×0.064×0.031 |  | frame, belt |
| game/factory/conveyor_start | 144 | 0 | 10.3 | 0.080×0.064×0.050 | spawn_anchor | frame |
| game/factory/sort_gate (+2 varian) | 88 | 88 | 11.0 | 0.064×0.064×0.121 | label_anchor | arch, sign, chute |
| game/factory/sort_bin | 60 | 0 | 4.3 | 0.084×0.063×0.040 | drop_anchor | bin |
| game/factory/item_token | 68 | 0 | 6.0 | 0.040×0.040×0.021 | label_anchor, hand_anchor | token |
| game/bridge/gap_cliffs | 56 | 0 | 7.4 | 0.400×0.100×0.060 | socket_plank_start, socket_plank_end | cliff_right, cliff_left |
| game/bridge/plank_1 | 40 | 0 | 4.1 | 0.240×0.040×0.006 | label_anchor, hand_anchor | plank |
| game/bridge/plank_1_2 | 40 | 0 | 4.1 | 0.120×0.040×0.006 | label_anchor, hand_anchor | plank |
| game/bridge/plank_1_3 | 40 | 0 | 4.1 | 0.080×0.040×0.006 | label_anchor, hand_anchor | plank |
| game/bridge/plank_1_4 | 40 | 0 | 4.1 | 0.060×0.040×0.006 | label_anchor, hand_anchor | plank |
| game/bridge/plank_1_5 | 40 | 0 | 4.1 | 0.048×0.040×0.006 | label_anchor, hand_anchor | plank |
| game/bridge/plank_1_6 | 40 | 0 | 4.1 | 0.040×0.040×0.006 | label_anchor, hand_anchor | plank |
| game/bridge/plank_1_8 | 40 | 0 | 4.1 | 0.030×0.040×0.006 | label_anchor, hand_anchor | plank |
| game/bridge/plank_1_10 | 40 | 0 | 4.1 | 0.024×0.040×0.006 | label_anchor, hand_anchor | plank |
| game/bridge/bridge_post | 56 | 0 | 5.1 | 0.015×0.015×0.050 |  | post |
| game/balance/scale | 234 | 0 | 18.4 | 0.295×0.080×0.142 | socket_right_pan, label_anchor_right, socket_left_pan, label_anchor_left | base, pillar, beam, pan_right, pan_left |
| game/balance/weight_block | 40 | 0 | 4.0 | 0.035×0.036×0.030 | label_anchor, hand_anchor | block |
| game/balance/gate | 120 | 0 | 11.7 | 0.140×0.033×0.140 | exit_anchor | frame, door_right, door_left |
| game/measure/tape_measure | 300 | 0 | 20.3 | 0.073×0.050×0.021 | hand_anchor | housing, tape, tape_end |
| game/measure/ruler_30 | 500 | 0 | 31.2 | 0.310×0.030×0.004 |  | ruler |
| game/measure/marker_pin (+1 varian) | 90 | 96 | 9.7 | 0.018×0.018×0.051 | hand_anchor | pin |
| game/measure/treasure_chest | 108 | 0 | 9.4 | 0.070×0.053×0.049 | reward_anchor | chest, lid |

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

## B3. Model bantuan visual ✅

Folder `models/hints/`. Semua lolos validator. Pratinjau: `previews/hints/`, `previews/sheet_hints.png`.

| File | Segitiga | +garis | KB | Ukuran | Anchor | Bagian |
|---|---|---|---|---|---|---|
| hints/base10_unit | 44 | 0 | 3.4 | 0.010×0.010×0.010 |  | cube |
| hints/base10_rod | 336 | 0 | 18.7 | 0.100×0.011×0.011 |  | rod |
| hints/base10_flat | 408 | 0 | 23.0 | 0.101×0.101×0.011 |  | flat |
| hints/number_line | 112 | 0 | 10.2 | 0.300×0.020×0.005 | tick_0, label_anchor_0, tick_1, label_anchor_1, tick_2, label_anchor_2, tick_3, label_anchor_3, tick_4, label_anchor_4, tick_5, label_anchor_5, tick_6, label_anchor_6, tick_7, label_anchor_7, tick_8, label_anchor_8, tick_9, label_anchor_9, tick_10, label_anchor_10 | line |
| hints/bar_strip | 20 | 0 | 2.5 | 0.240×0.030×0.005 |  | strip |
| hints/area_grid | 188 | 0 | 12.9 | 0.152×0.152×0.003 | cell_origin | grid |
| hints/pie_slice_2 | 195 | 0 | 11.2 | 0.060×0.120×0.007 |  | slice |
| hints/pie_slice_3 | 132 | 0 | 8.5 | 0.060×0.104×0.007 |  | slice |
| hints/pie_slice_4 | 100 | 0 | 7.1 | 0.060×0.085×0.007 |  | slice |
| hints/pie_slice_5 | 84 | 0 | 6.4 | 0.059×0.071×0.007 |  | slice |
| hints/pie_slice_6 | 68 | 0 | 5.6 | 0.060×0.060×0.007 |  | slice |
| hints/pie_slice_8 | 52 | 0 | 5.0 | 0.059×0.046×0.007 |  | slice |
| hints/pie_slice_10 | 52 | 0 | 5.0 | 0.060×0.037×0.007 |  | slice |
| hints/pie_slice_12 | 36 | 0 | 4.2 | 0.060×0.031×0.007 |  | slice |

Catatan:
- Satuan basis 10 bersama: kubus 10 mm. Batang = 10 kubus dengan lipatan berbayang di antara kubus;
  lempeng = 10 batang berjajar dengan lipatan satuan di dua arah, bukan 100 kubus penuh yang akan 1200+ segitiga.
- `number_line`: tick setiap 0.028 m, lebih panjang di 0, 5, 10; tanpa angka.
- `bar_strip`: origin di ujung kiri supaya skala x memotong dari kanan.
- `area_grid`: node `cell_*` (opsional) diganti satu anchor `cell_origin` plus langkah 0.015 m, jauh lebih ringan.
- `pie_slice_<n>` untuk n = 2, 3, 4, 5, 6, 8, 10, 12: origin di pusat pie, irisan menunjuk +X, dengan kulit kertas krem di tepi lengkung.

## B4. Portal ✅

Folder `models/game/portal/`. Pratinjau: `previews/game/portal/`, `previews/sheet_portal.png`.

| File | Segitiga | +garis | KB | Ukuran | Anchor | Bagian |
|---|---|---|---|---|---|---|
| game/portal/portal_main | 364 | 0 | 23.6 | 0.140×0.020×0.142 | spawn_anchor | ring_outer, ring_inner |
| game/portal/partner_window | 64 | 0 | 5.9 | 0.180×0.011×0.120 | view_anchor, label_anchor | frame |
| game/portal/help_orb_trail | 60 | 0 | 5.6 | 0.088×0.002×0.015 |  | trail |

Catatan: `spawn_anchor` portal utama ada di meja tepat di depan portal (makhluk berjalan keluar), pusat
portal di (0, 0.072, 0) sebagai poros `ring_inner`.

## B5. Karakter ✅

Folder `models/characters/`. Semua menghadap pemain (+Z); tangan kiri karakter di +X. Klip: Pip `idle, wave,
cheer, point, think`; robot `idle, wave, cheer, help`; The Great Crumple `idle, hit, unfold`.
Pratinjau: `previews/characters/`, `previews/sheet_characters.png`, `previews/clips/`.

| File | Segitiga | +garis | KB | Ukuran | Anchor | Bagian |
|---|---|---|---|---|---|---|
| characters/pip_owl | 1088 | 0 | 73.3 | 0.069×0.049×0.110 | label_anchor | body, head, eyes, eyes_happy, wing_l, wing_r |
| characters/great_crumple | 1309 | 0 | 98.5 | 0.193×0.220×0.174 | label_anchor_0, label_anchor_1, label_anchor_2 | stage_1, stage_2, stage_3, core, eyes |
| characters/robot_partner_a | 508 | 0 | 43.9 | 0.047×0.025×0.079 | label_anchor | body, head, antenna, arm_l, arm_r |
| characters/robot_partner_b | 510 | 0 | 45.5 | 0.049×0.032×0.083 | label_anchor | body, head, antenna, arm_l, arm_r |
| characters/robot_partner_c | 496 | 0 | 40.1 | 0.048×0.025×0.086 | label_anchor | body, head, antenna, arm_l, arm_r |

Catatan:
- **Pip**: burung hantu kertas warna pasir, kacamata bundar dari delapan lipatan navy (bentuk umum, bukan merek),
  bulu dada chevron krem. `label_anchor` = tempat gelembung bicara, di atas kiri Pip.
- **The Great Crumple**: tiga lapis gumpalan kusut (`stage_1` luar, lavender; `stage_2` violet; `stage_3` lavender)
  dengan mata kertas besar dan alis agak cemas supaya lucu, bukan seram. `core` (bangau emas yang rapi) diam di
  skala 0.001; klip `unfold` mengelupas tiga lapis satu per satu lalu menumbuhkan bangau. Berkas 98 KB (di atas
  target 60 KB, di bawah 150 KB) karena 1157 segitiga untuk tiga lapis.
- **Robot partner**: tiga desain fiktif yang jelas robot (kotak dengan kaki balok, bulat beroda dengan visor,
  tinggi berpegas dengan capit), masing-masing punya antena dan lampu kepala. Segitiganya 306 sampai 390, sedikit
  di bawah 400, karena bentuk kotak memang hemat segi.

## B6. Fold Town ✅

Bangunan skill di `models/buildings/`, alas kota di `models/areas/`. Satuan **petak** (manifest `unit: "tile"`,
`footprint`), alas rumput 0.04 seperti aset kota, jadi bisa disusun dengan jalan yang sudah ada. Garis tinta
dibuat 0.02 petak (= 0.6 mm di halaman buku). Pratinjau: `previews/buildings/skill_*.png`,
`previews/sheet_foldtown.png`, `previews/table_b6_{wood,white}.png`.

| File | Segitiga | +garis | KB | Ukuran (petak) | Anchor | Bagian |
|---|---|---|---|---|---|---|
| buildings/skill_fraction_bridge_t1 | 264 | 0 | 17.3 | 2.000×1.000×0.215 |  | base, grow_deck, grow_rails |
| buildings/skill_fraction_bridge_t2 | 504 | 0 | 29.3 | 2.000×1.000×0.435 |  | base, grow_arch, grow_deck, grow_rails |
| buildings/skill_fraction_bridge_t3 | 768 | 0 | 44.9 | 2.000×1.000×0.840 |  | base, grow_towers, grow_deck, grow_cables |
| buildings/skill_multiply_tower_t1 | 258 | 0 | 18.6 | 1.000×1.000×0.580 |  | base, floor_1, floor_2, roof |
| buildings/skill_multiply_tower_t2 | 498 | 0 | 33.6 | 1.000×1.000×0.960 |  | base, floor_1, floor_2, floor_3, floor_4, roof |
| buildings/skill_multiply_tower_t3 | 756 | 0 | 49.9 | 1.000×1.000×1.620 |  | base, floor_1, floor_2, floor_3, floor_4, floor_5, floor_6, roof |
| buildings/skill_placevalue_hall_t1 | 136 | 0 | 9.7 | 2.000×1.000×0.530 |  | base, wing_center |
| buildings/skill_placevalue_hall_t2 | 344 | 0 | 22.3 | 2.000×1.000×0.620 |  | base, wing_center, wing_left, wing_right |
| buildings/skill_placevalue_hall_t3 | 420 | 0 | 27.4 | 2.000×1.000×1.040 |  | base, wing_center, wing_left, wing_right, wing_dome |
| buildings/skill_decimal_market_t1 | 256 | 0 | 18.4 | 2.000×1.000×0.400 |  | base, plaza, stall_1, stall_2 |
| buildings/skill_decimal_market_t2 | 488 | 0 | 33.4 | 2.000×1.000×0.400 |  | base, plaza, stall_1, stall_2, stall_3, stall_4 |
| buildings/skill_decimal_market_t3 | 812 | 0 | 54.1 | 2.000×1.000×0.690 |  | base, plaza, stall_1, stall_2, stall_3, stall_4, stall_5, stall_6, stall_canopy |
| buildings/skill_measure_clocktower_t1 | 286 | 0 | 19.6 | 1.000×1.000×0.870 |  | base, tower, clock_face, hand_hour, hand_minute |
| buildings/skill_measure_clocktower_t2 | 310 | 0 | 20.9 | 1.000×1.000×1.300 |  | base, tower, clock_face, hand_hour, hand_minute |
| buildings/skill_measure_clocktower_t3 | 322 | 0 | 21.5 | 1.000×1.000×1.600 |  | base, tower, clock_face, hand_hour, hand_minute |
| areas/town_page_grid | 132 | 0 | 9.6 | 10.000×7.000×0.046 | cell_origin | page |

Catatan:
- Setiap tingkat utuh dan layak tampil sendiri; tingkat berikutnya lebih besar: jembatan kayu pendek, lalu lengkung,
  lalu gantung; menara 2, 4, lalu 6 lantai dengan menara runcing; balai 1, 3, lalu 3 sayap dengan kubah; pasar 2, 4,
  lalu 6 kios dengan kanopi tengah; menara jam makin tinggi.
- Jam tanpa angka: 12 tanda jam, jarum `hand_hour` dan `hand_minute` berputar pada sumbu z di pusat jam.
- **Perlu keputusan:** dengan 1 petak = 0.03 m, alas 10 × 7 petak berukuran 0.30 × 0.21 m. Ukuran ini tidak muat di
  halaman kanan buku (0.164 × 0.22 m), tetapi muat melintang di kedua halaman (lihat `table_b6_wood.png`).
  Supaya muat di halaman kanan, skalanya harus sekitar 0.016 m per petak. `models/scale.json` tetap 0.03 sesuai brief.

## B7. Hadiah dan UI 3D ✅

Folder `models/rewards/` dan `models/ui/`. Pratinjau: `previews/sheet_rewards.png`, `previews/sheet_ui.png`.

| File | Segitiga | +garis | KB | Ukuran | Anchor | Bagian |
|---|---|---|---|---|---|---|
| rewards/star | 30 | 0 | 3.7 | 0.048×0.016×0.045 |  | star |
| rewards/star_empty | 120 | 0 | 7.8 | 0.050×0.003×0.047 |  | star |
| rewards/badge_best_save | 272 | 0 | 16.1 | 0.060×0.011×0.076 |  | badge, ribbon |
| rewards/badge_most_improved | 228 | 0 | 14.0 | 0.060×0.011×0.076 |  | badge, ribbon |
| rewards/badge_sharpest_aim | 500 | 0 | 26.1 | 0.060×0.011×0.076 |  | badge, ribbon |
| rewards/badge_steady_streak | 352 | 0 | 20.5 | 0.060×0.011×0.076 |  | badge, ribbon |
| rewards/badge_brave_try | 232 | 0 | 14.3 | 0.060×0.012×0.076 |  | badge, ribbon |
| rewards/streak_shield | 104 | 0 | 8.0 | 0.044×0.009×0.050 |  | shield |
| rewards/trophy_paper | 218 | 0 | 14.0 | 0.062×0.044×0.076 |  | trophy |
| ui/paper_button | 36 | 0 | 4.3 | 0.100×0.012×0.065 | label_anchor | card, press |
| ui/paper_panel | 56 | 0 | 5.6 | 0.300×0.013×0.200 | label_anchor | panel |
| ui/palm_menu_disc | 92 | 0 | 7.4 | 0.080×0.006×0.080 | slot_0, slot_1, slot_2, slot_3 | disc |

Catatan: lencana hanya berisi simbol bentuk (tangan menangkap bola, panah naik, target, rantai, gunung) tanpa tulisan.
Tinggi lencana 0.076 m karena pitanya menggantung di bawah cakram 0.06 m. `paper_button`: `press` bergerak ke -z
sampai 5 mm. `palm_menu_disc`: `slot_0` di atas, lalu searah jarum jam.

## B8. Efek ✅

Folder `models/fx/`. Pratinjau: `previews/sheet_fx.png`.

| File | Segitiga | +garis | KB | Ukuran | Anchor | Bagian |
|---|---|---|---|---|---|---|
| fx/confetti_pieces | 234 | 0 | 20.5 | 0.070×0.003×0.053 |  | piece_0, piece_1, piece_2, piece_3, piece_4, piece_5, piece_6, piece_7, piece_8, piece_9, piece_10, piece_11 |
| fx/paper_scraps | 148 | 0 | 19.9 | 0.063×0.004×0.037 |  | scrap_0, scrap_1, scrap_2, scrap_3, scrap_4, scrap_5 |
| fx/fold_crease | 102 | 0 | 9.1 | 0.108×0.006×0.007 |  | crease |
| fx/sparkle | 24 | 0 | 3.3 | 0.030×0.005×0.030 |  | sparkle |

Catatan: konfeti memakai lima warna misi tanpa sisi bayangan (6 material termasuk tinta). `fold_crease` dan `sparkle`
tanpa garis tinta supaya terlihat berkilau, bukan seperti stiker.

## B9. Hewan origami dari dua buku ✅

Dibuat dari dua buku origami (tidak disertakan di repo ini; buku 1 "Comic Origami 3": hewan darat, laut, serangga, mitos; buku 2: burung). Ringkasan teknik ada di
[ORIGAMI_ANIMALS.md](ORIGAMI_ANIMALS.md); yang ditiru adalah prinsip lipatnya (badan berupa beberapa bidang datar besar, sisi belakang putih di tempat kertas terbalik, kaki, telinga, dan ekor berupa strip sekali lipat, mata bulat polos), bukan desain lipatan persisnya.
Satu warna kertas per hewan ditambah putih untuk bagian yang terbalik; paling banyak 6 material; tanpa garis tinta. Semua lolos validator (0 error, 0 warning), klip animasi sama seperti Foldlings (`idle`, `hop`, `cheer`, `bounce`, `fold`; burung terbang juga punya `flap`).
Folder: `models/origami-animals/`. Ukuran = kotak batas nyata. Pratinjau: `previews/sheet_origami_land.png`, `_sea`, `_small`, `_myth`, `_birds`.


Revisi 29 September 2026 (masukan: hampir semua mulut dan bentuk sama, runcing): tiap spesies kini punya bentuk wajah sendiri
(`FACES` di `scripts/lib/zoo.mjs`): rubah dan serigala bermoncong runcing, kucing berwajah lebar dan pendek, babi dan kuda nil
bermoncong kotak datar, berang-berang berkepala bulat dengan gigi depan, mamut berkepala kubah dengan telinga lebar di samping,
griffin berkepala elang dengan paruh bengkok. Badan juga dibedakan: kucing berbaring, babi dan kuda nil seperti tong, kelinci
bulat dengan kaki belakang besar, meerkat berdiri tegak. Kepala Foldlings kelinci, kucing, dan gajah ikut diganti.

### Hewan darat (11)

| File | Nama | Segitiga | KB | Ukuran (x×z×y, m) |
|---|---|---|---|---|
| origami-animals/origami_squirrel | Tupai | 468 | 45.6 | 0.048×0.026×0.049 |
| origami-animals/origami_rabbit | Kelinci | 498 | 48.6 | 0.039×0.032×0.068 |
| origami-animals/origami_fox | Rubah | 456 | 47.2 | 0.072×0.021×0.064 |
| origami-animals/origami_cat | Kucing | 460 | 47.4 | 0.070×0.028×0.039 |
| origami-animals/origami_pig | Babi | 550 | 48.2 | 0.055×0.029×0.035 |
| origami-animals/origami_beaver | Berang-berang | 456 | 45.5 | 0.071×0.024×0.028 |
| origami-animals/origami_tiger | Harimau | 562 | 52.4 | 0.074×0.029×0.057 |
| origami-animals/origami_hippo | Kuda nil | 566 | 50.4 | 0.077×0.034×0.038 |
| origami-animals/origami_meerkat | Meerkat | 466 | 45.7 | 0.058×0.019×0.056 |
| origami-animals/origami_wolf | Serigala | 486 | 48.5 | 0.108×0.028×0.060 |
| origami-animals/origami_mammoth | Mamut | 420 | 45.0 | 0.079×0.036×0.059 |

### Hewan air (5)

| File | Nama | Segitiga | KB | Ukuran (x×z×y, m) |
|---|---|---|---|---|
| origami-animals/origami_shark | Hiu thresher | 220 | 25.4 | 0.075×0.041×0.041 |
| origami-animals/origami_whale | Paus | 212 | 24.8 | 0.076×0.055×0.041 |
| origami-animals/origami_pufferfish | Ikan buntal | 228 | 24.7 | 0.050×0.045×0.039 |
| origami-animals/origami_squid | Cumi terbang | 262 | 26.4 | 0.025×0.041×0.057 |
| origami-animals/origami_walrus | Walrus | 484 | 39.3 | 0.064×0.031×0.040 |

### Serangga dan reptil (5)

| File | Nama | Segitiga | KB | Ukuran (x×z×y, m) |
|---|---|---|---|---|
| origami-animals/origami_shieldbug | Kutu perisai | 380 | 36.8 | 0.048×0.054×0.018 |
| origami-animals/origami_katydid | Belalang katydid | 498 | 41.2 | 0.053×0.026×0.045 |
| origami-animals/origami_snake | Ular | 238 | 21.6 | 0.056×0.012×0.041 |
| origami-animals/origami_chameleon | Bunglon | 424 | 39.6 | 0.054×0.021×0.032 |
| origami-animals/origami_stegosaurus | Stegosaurus | 496 | 43.8 | 0.084×0.022×0.038 |

### Makhluk mitos (4)

| File | Nama | Segitiga | KB | Ukuran (x×z×y, m) |
|---|---|---|---|---|
| origami-animals/origami_griffin | Griffin | 414 | 41.1 | 0.080×0.061×0.062 |
| origami-animals/origami_winged_lion | Singa bersayap | 496 | 48.4 | 0.079×0.065×0.059 |
| origami-animals/origami_dragon | Naga (Loong) | 574 | 54.4 | 0.103×0.035×0.053 |
| origami-animals/origami_phoenix | Burung api (phoenix) | 344 | 38.8 | 0.070×0.077×0.049 |

### Burung (22)

| File | Nama | Segitiga | KB | Ukuran (x×z×y, m) |
|---|---|---|---|---|
| origami-animals/origami_duck | Bebek | 272 | 32.3 | 0.052×0.018×0.028 |
| origami-animals/origami_seagull | Camar | 272 | 32.5 | 0.050×0.016×0.032 |
| origami-animals/origami_vulture | Bangkai (vulture) | 262 | 31.8 | 0.055×0.022×0.041 |
| origami-animals/origami_rooster | Ayam jago | 262 | 31.4 | 0.049×0.020×0.049 |
| origami-animals/origami_cardinal | Kardinal | 278 | 31.8 | 0.059×0.019×0.034 |
| origami-animals/origami_sparrow | Burung pipit | 254 | 31.1 | 0.046×0.016×0.026 |
| origami-animals/origami_blue_jay | Jay biru | 286 | 35.3 | 0.058×0.018×0.032 |
| origami-animals/origami_toucan | Tukan | 254 | 32.3 | 0.066×0.018×0.033 |
| origami-animals/origami_flycatcher | Burung sikatan biru | 248 | 30.6 | 0.048×0.016×0.026 |
| origami-animals/origami_magpie | Magpie | 248 | 29.5 | 0.076×0.016×0.027 |
| origami-animals/origami_penguin | Pinguin | 248 | 31.1 | 0.042×0.020×0.040 |
| origami-animals/origami_long_tailed_tit | Burung tit ekor panjang | 248 | 29.9 | 0.059×0.014×0.024 |
| origami-animals/origami_bald_eagle | Elang botak | 264 | 32.1 | 0.056×0.060×0.040 |
| origami-animals/origami_hummingbird | Kolibri | 236 | 30.0 | 0.049×0.053×0.025 |
| origami-animals/origami_swallow | Burung walet | 256 | 31.2 | 0.056×0.081×0.018 |
| origami-animals/origami_peacock | Merak | 876 | 61.7 | 0.055×0.052×0.049 |
| origami-animals/origami_flamingo | Flamingo | 262 | 31.3 | 0.041×0.016×0.073 |
| origami-animals/origami_egret | Bangau putih (egret) | 262 | 31.5 | 0.048×0.014×0.069 |
| origami-animals/origami_ostrich | Burung unta | 262 | 31.4 | 0.048×0.022×0.084 |
| origami-animals/origami_shoebill | Shoebill | 272 | 33.3 | 0.056×0.018×0.053 |
| origami-animals/origami_owl | Burung hantu | 286 | 34.2 | 0.041×0.020×0.037 |
| origami-animals/origami_parrot | Beo (parrot) | 264 | 32.1 | 0.070×0.018×0.034 |

Kolibri dan walet melayang (badan 2,6 cm di atas meja, titik asal tetap di meja). Ikan, paus, hiu, cumi, dan ikan buntal juga melayang 2,6 sampai 3 cm.

## 2D. Avatar, kata sandi gambar, merek, dan ikon ✅

Folder `2d/`, dibuat dengan `npm run build:2d`. Semua SVG disusun dari poligon oleh skrip (tanpa font, tanpa gambar
pihak ketiga, hanya warna palet). Rincian ukuran ada di [`FOLDLINGS.md`](FOLDLINGS.md#2d-assets).

| Kelompok | Berkas | Jumlah |
|---|---|---|
| Avatar | `avatars/avatar_<spesies>_<misi>` SVG + PNG 256 dan 512 | 40 |
| Kata sandi gambar | `picture_password/pp_` star, moon, sun, leaf, fish, boat, key, heart, cloud (SVG + PNG 256) | 9 |
| Logo | `brand/logo_foldlings` (terang) dan `logo_foldlings_dark` (gelap), PNG lebar 1200 | 2 |
| Ikon aplikasi | `brand/app_icon`, `app_icon_maskable` (PNG 192, 512, 1024), `favicon` (PNG 32, 48) | 3 |
| Gambar promosi | `brand/devpost_thumbnail` 1920×1080 dan 1200×630, `social_preview` 1280×640 | 3 |
| Ikon game | `icons/game_` orb_forge, balloon_burst, factory_sort, bridge_builder, balance_gate, measure_hunt (PNG 128, 256) | 6 |
| Ikon misi | `icons/mission_<misi>` (PNG 128), simbol saja | 5 |

Keputusan: logo memakai huruf kapital FOLDLINGS dari pita kertas terlipat (tiap huruf satu warna misi) dan
bangau kecil; versi "dark" untuk latar gelap memakai tepi kertas tipis, bukan latar gelap, supaya tetap transparan. Aset 2D tidak
memakai garis tepi hitam; potongan kertas diberi bayangan tipis supaya terlihat seperti kertas yang ditempel.
Ikon maskable memenuhi kanvas dengan gambar di dalam zona aman 80%. Warna ikon game: Orb Forge sunflower,
Balloon Burst coral, Factory Sort cobalt, Bridge Builder teal, Balance Gate violet, Measure Hunt orange.
Gambar promosi dirender dari model (adegan meja B1) dengan logo di spanduk kertas.
