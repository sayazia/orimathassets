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
