import { CraftItem } from './types';

export const INITIAL_CRAFTS: CraftItem[] = [
  {
    id: "craft-1",
    name: "Sarung Tenun Sutera Sengkang Corak Makkalu",
    category: "Tekstil",
    region: "Bugis (Sengkang)",
    material: "Sutera Alam Asli (Thread count premium, pewarna alami ekor serangga)",
    dimensions: "400cm x 115cm",
    price: 380000,
    artisanName: "Ibu Nurhayati",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600", // Bag / textile themed beautiful image
    philosophy: "Melambangkan kesucian bertingkah laku, kemakmuran, dan tata karma luhur adat Bugis Sengkang. Corak garis melingkar menggambarkan roda kehidupan yang terus berputar namun tetap berakar pada keteguhan prinsip hidup.",
    motifs: ["Corak Makkalu (Garis Berputar Simbol Kehidupan)", "Cobbo-Cobbo (Kotak Kejujuran)", "Ballo Makalu (Keindahan Abadi)"],
    story: "Ditenun secara manual selama lebih dari 3 minggu oleh Ibu Nurhayati di pusat tenun tradisional Wajo, Sengkang. Menggunakan ATBM (Alat Tenun Bukan Mesin), setiap jengkal kain ini melambangkan kesabaran yang luar biasa. Sutera ditenun dengan benang sutera pintal lokal, menghasilkan permukaan kain yang memiliki karakteristik kilau dinamis saat terkena cahaya matahari langsung, menghadirkan estetika premium bagi yang memakainya.",
    artisanNotes: "Ibu Nurhayati telah menenun selama 25 tahun, mempertahankan teknik pewarnaan sutera kuno dari rebusan kulit kayu pohon mangga dan daun mangga kering.",
    ratings: 4.9,
    dimensions_cm: { w: 400, h: 0.2, d: 115 }
  },
  {
    id: "craft-2",
    name: "Kotak Penyimpanan Kayu Ukiran Passura' Toraja",
    category: "Kayu",
    region: "Toraja",
    material: "Kayu Cendana Wangi Pilihan, Lemak Lembu & Pewarna Tanah Liat Tradisional",
    dimensions: "45cm x 30cm x 25cm",
    price: 1250000,
    artisanName: "Sdr. Pong Tasik",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600", // Wooden box / craft themed image
    philosophy: "Kotak penyimpanan suci berlaskar ukiran Passura' Toraja berakar dari filosofi Aluk To Dolo. Setiap lekukan garisnya mengajarkan penghormatan terhadap Sang Pencipta, leluhur (Kehadiran), persaudaraan abadi, serta rasa syukur atas rezeki yang diberkati.",
    motifs: ["Pa' Barre Allo (Matahari Terbit: Sumber Kehidupan)", "Pa' Tedong (Kepala Kerbau: Kemakmuran & Strata Sosial)", "Pa' Manuk London (Ayam Jantan: Kebenaran & Keberanian)"],
    story: "Dipahat dengan segenap ketelitian oleh Pong Tasik di desa adat Kete Kesu, Kabupaten Tana Toraja. Kayu cendana dikeringkan secara alami selama 6 bulan untuk mencegah retak. Ukiran dilakukan menggunakan pahat baja khusus dalam ritual sunyi tanpa bantuan mesin. Kotak ini dilapisi minyak kemiri murni yang memberikan kilau semi-matte bernuansa hangat dan mengeluarkan keharuman magis cendana yang khas.",
    artisanNotes: "Setiap corak diukir dengan memprioritaskan simetrisitas spiritual. Pong Tasik mendedikasikan 40 jam kerja murni di atas sebongkah kayu cendana utuh.",
    ratings: 5.0,
    dimensions_cm: { w: 45, h: 25, d: 30 }
  },
  {
    id: "craft-3",
    name: "Miniatur Kapal Phinisi Finisi Bulukumba",
    category: "Miniatur",
    region: "Makassar",
    material: "Kayu Jati Solid, Tali Anyaman Sabut Kelapa, Kain Katun Terpal Canvas",
    dimensions: "90cm x 35cm x 75cm",
    price: 4200000,
    artisanName: "Daeng Pasolle",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600", // Nautical / ship image
    philosophy: "Representasi kejayaan pelaut Makassar-Bugis yang menaklukkan rintangan samudera luas. Melambangkan semboyan 'Kualleangi Tallanga Na Toalia' (Lebih baik tenggelam di lautan daripada kembali ke pantai tanpa hasil).",
    motifs: ["Layar Kajang (Ketahanan Terhadap Angin Hambat)", "Haluan Kokoh (Ketabahan Jiwa)"],
    story: "Dikerjakan langsung di pesisir Pantai Bira, Bulukumba, oleh maestro pembuat kapal Daeng Pasolle. Pembuatan miniatur ini menggunakan rasio simetri kapal Phinisi asli ukuran raksasa tingkat presisi milimeter. Miniatur kayu jati ini dirakit tanpa menggunakan paku logam, melainkan pasak kayu jati tradisional, merefleksikan keahlian magis nenek moyang dalam membangun mahakarya maritim legendaris.",
    artisanNotes: "Miniatur ini dilengkapi 7 layar melambangkan 7 samudra dunia yang telah berhasil diarungi nenek moyang bangsa Indonesia sejak abad ke-14.",
    ratings: 4.8,
    dimensions_cm: { w: 90, h: 75, d: 35 }
  },
  {
    id: "craft-4",
    name: "Keris Badik Gecong Pusaka Pamor Kurissi",
    category: "Logam",
    region: "Mandar",
    material: "Baja Tempaan Meteorit, Gagang Tanduk Kerbau Hitam, Sarung Kayu Kemuning Sisi Perak",
    dimensions: "35cm x 6cm x 3cm",
    price: 2950000,
    artisanName: "Ambo Tuo",
    imageUrl: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=600", // Metallic / weapon craft visual
    philosophy: "Badik Gecong legendaris Bugis melambangkan kewibawaan spiritual, ketenangan jiwa, dan integritas ksatria. Pamor Kurissi yang mengular vertikal di sepanjang bilah dipercaya memancarkan energi persatuan serta pelindung marabahaya bagi sang pemilik.",
    motifs: ["Pamor Kurissi (Gelombang Karisma)", "Batu Lappa (Perlindungan Spiritual)"],
    story: "Ditempa oleh pandai besi legendaris Ambo Tuo di Sidenreng Rappang menggunakan teknik pelipatan logam meteorit tradisional sebanyak 256 lapis. Pola pamor yang terbentuk murni akibat reaksi kimiawi pemanasan bersuhu tinggi, memberikan guratan perak berkemilau alami. Dilengkapi hulu berukir dari tanduk kerbau hitam pilihan dan dihiasi kawat perak halus yang dirajut manual.",
    artisanNotes: "Ambo Tuo adalah keturunan kelima Empu Kerajaan Bugis, mengorbankan waktu 2 minggu pengerjaan ritualistik untuk menempa satu bilah pusaka yang seimbang sempurna.",
    ratings: 4.9,
    dimensions_cm: { w: 35, h: 3, d: 6 }
  }
];

export const PROPOSAL_DETAILS = {
  team: {
    name: "Balala",
    leader: "Muhammad Ramdan Alqadri",
    members: [
      { name: "Muhammad Ramdan Alqadri", role: "Ketua Tim / Business & Marketing Strategist", details: "Mahasiswa Bisnis Digital Universitas Negeri Makassar (UNM)." },
      { name: "Mohalfinoor Wirabuana", role: "Programmer / Technical Developer", details: "Mahasiswa Bisnis Digital Universitas Negeri Makassar (UNM) yang menguasai core coding dan front-end engineering." }
    ],
    contact: {
      phone: "082246699991",
      email: "ramdanalqadri35@gmail.com",
      institution: "Universitas Negeri Makassar",
      portfolio: "https://from-alifanurannisa.my.canva.site/portofolio-balla/"
    },
    summary: "Tim kami terdiri dari dua mahasiswa Bisnis Digital, yaitu Muhammad Ramdan Alqadri (Ketua) dan Mohalfinoor Wirabuana (Programmer). Kami memiliki kompetensi pada digital marketing, UI/UX, analisis data, dan pemrograman dasar, serta pengalaman sebagai demisioner bidang Data Analyst HIMABISDIG FEB UNM. Ketertarikan kami berangkat dari pengalaman nyata dalam kesulitan menyesuaikan produk kriya di rumah, serta kepedulian terhadap keberlanjutan UMKM budaya, sehingga mendorong lahirnya solusi Balla-AR."
  },
  executiveSummary: "Balla-AR adalah platform digital berbasis Augmented Reality (AR) yang memungkinkan konsumen memvisualisasikan produk kerajinan khas Sulawesi Selatan secara presisi dalam ruang nyata sebelum melakukan transaksi. Solusi ini menjawab problem statement Digitalisasi Ekonomi Kreatif, khususnya pada aspek Market Insight Industri Kreatif dan digitalisasi museum/warisan budaya. Dengan mengintegrasikan fitur Storytelling Budaya, platform ini tidak hanya meningkatkan brand value produk lokal, tetapi juga menciptakan ekosistem belanja yang transparan dan edukatif, sekaligus mendorong pertumbuhan ekonomi digital UMKM di Sulsel secara berkelanjutan.",
  problemStatements: {
    main: "UMKM kerajinan Sulawesi Selatan menghadapi dua masalah utama yang saling berkaitan:",
    points: [
      {
        title: "Ketidakpastian Dimensi dan Estetika",
        desc: "Konsumen online tidak dapat memperkirakan bagaimana produk kerajinan (seperti tenun sutera, ukiran kayu, barang mebel) akan terlihat dan berukuran dalam konteks nyata mereka. Hal ini menyebabkan tingginya tingkat pengembalian produk dan keengganan untuk melakukan pembelian."
      },
      {
        title: "Hilangnya Nilai Budaya dalam Transaksi Digital",
        desc: "Produk kerajinan lokal kehilangan keunggulan kompetitifnya karena filosofi, teknik, dan cerita di balik setiap karya tidak tersampaikan kepada konsumen melalui platform digital konvensional. Akibatnya, produk lokal sering kalah bersaing harga dengan produk massal tanpa nilai budaya."
      }
    ],
    impacted: [
      { group: "UMKM Kerajinan", detail: "Lebih dari 47.000 unit UMKM kerajinan di Sulawesi Selatan (BPS 2023) yang mayoritas bergantung pada penjualan konvensional dan kesulitan menembus pasar digital." },
      { group: "Konsumen Online", detail: "Jutaan konsumen yang tertarik pada produk etnik dan budaya tetapi ragu membeli karena keterbatasan representasi produk di platform digital ekonomi kreatif." }
    ],
    proofs: [
      "Survei Lapangan Pasar Sentral Makassar (2024): 78% pengrajin mengeluh produk mereka dianggap imajinasi/imitasi karena minimnya informasi konteks budaya di platform digital.",
      "Riset Nielsen (2022): 67% konsumen online ragu membeli furnitur karena ketidakpastian ukuran dan tampilan produk pada ruang nyata.",
      "Kemenkop UKM (2023): Hanya 23% UMKM kriya yang masuk ekosistem digital dengan konversi rendah (1.2%), jauh di bawah standar global.",
      "Google/Temasek/Bain (2023): Penetrasi UMKM ekonomi kreatif ke kanal digital masih di bawah 15%, meski ekonomi digital nasional tumbuh 20% per tahun.",
      "UNESCO (2021): 30% kerajinan tradisional Indonesia terancam punah akibat minimnya dokumentasi dan akses pasar digital yang memadai."
    ]
  },
  bmc: [
    { key: "Customer Segments", value: "UMKM kerajinan Sulsel, konsumen produk etnik, marketplace nasional." },
    { key: "Value Propositions", value: "Visualisasi AR presisi, narasi budaya, tools mudah bagi UMKM." },
    { key: "Channels", value: "App Store & Play Store, Dinas Koperasi, komunitas, marketplace." },
    { key: "Customer Relationships", value: "Self-service, komunitas, onboarding UMKM." },
    { key: "Revenue Streams", value: "Subscription Rp99–299 ribu, komisi 1.5–2.5%, API licensing, grant & CSR." },
    { key: "Key Resources", value: "Teknologi AR & AI 3D, database budaya, tim developer, infrastruktur cloud." },
    { key: "Key Activities", value: "Pengembangan AR, kurasi budaya, onboarding UMKM, partnership." },
    { key: "Key Partners", value: "Dinas Kebudayaan Sulsel, komunitas pengrajin." },
    { key: "Cost Structure", value: "Infrastruktur (40%), pengembangan (35%), pemasaran (15%), operasional (10%)." }
  ],
  techStack: [
    { title: "AR Engine", desc: "ARCore & ARKit sebagai AR engine untuk spatial mapping dan object placement." },
    { title: "AI-Assisted 3D Modeling", desc: "NeRF (Neural Radiance Fields) & Gaussian Splatting untuk konversi foto multi-angle ke model 3D otomatis." },
    { title: "Cross-Platform Mobile", desc: "React Native untuk pengembangan aplikasi seluler iOS dan Android satu codebase." },
    { title: "Distributed Storage", desc: "AWS S3 & CloudFront CDN untuk distribusi model 3D berukuran besar secara cepat." },
    { title: "Data Management", desc: "PostgreSQL & MongoDB untuk manajemen metadata produk, analitik perilaku, dan database filosofi warisan budaya." }
  ],
  outcomes: {
    shortTerm: [
      "Onboarding 50+ UMKM kerajinan pionir di Makassar dan Kabupaten Gowa.",
      "Rata-rata konversi penjualan e-commerce meningkat drastis dari 1.2% menjadi 3-4%.",
      "Dokumentasi digital & 3D model untuk lebih dari 1.000+ produk kriya daerah."
    ],
    mediumTerm: [
      "Ekspansi jaringan ke seluruh Sulawesi Selatan dengan 500+ UMKM tenun dan kayu aktif.",
      "Integrasi API Balla-AR dengan raksasa e-commerce nasional seperti Tokopedia dan Shopee.",
      "Peningkatan pendapatan bulanan UMKM mitra sebesar rata-rata 25% per tahun.",
      "Repositori digital warisan budaya dengan lebih dari 5.000+ entri produk bernarasi filosofis peninggalan Bugis-Makassar."
    ]
  }
};
