export type ProjectCategory = "Website" | "Graphic Design";
export type CategoryFilter = "all" | "website" | "graphic-design";

export interface LocalizedText {
  EN: string;
  ID: string;
}

export interface ProjectCaseStudy {
  problem: LocalizedText;
  trustPositioning: LocalizedText;
  whatChanged: LocalizedText;
}

export interface DetailedProject {
  id: string; // URL slug
  number: string;
  title: string;
  subtitle?: LocalizedText;
  category: ProjectCategory;
  categoryKey: "website" | "graphic-design";
  year: string;
  award?: string;
  client: string;
  role: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  caseStudy?: ProjectCaseStudy;
  stack: string[];
  heroImage: string;
  gallery: string[];
  liveUrl?: string;
  sourceUrl?: string;
  isGame?: boolean;
  gameUrl?: string;
}

export const CATEGORIES_CONFIG: {
  key: CategoryFilter;
  label: LocalizedText;
  countKey?: "website" | "graphic-design";
}[] = [
  {
    key: "all",
    label: {
      EN: "All",
      ID: "Semua",
    },
  },
  {
    key: "website",
    label: {
      EN: "Website",
      ID: "Website",
    },
    countKey: "website",
  },
  {
    key: "graphic-design",
    label: {
      EN: "Graphic Design",
      ID: "Desain Grafis",
    },
    countKey: "graphic-design",
  },
];

export const DETAILED_PROJECTS: DetailedProject[] = [
  {
    id: "super-smash-badminton",
    number: "01",
    title: "Super Smash Badminton Arcade",
    subtitle: {
      EN: "2D Arcade Badminton Championship & Physics Engine",
      ID: "Game Bulutangkis Arcade 2D & Simulasi Fisika",
    },
    category: "Website",
    categoryKey: "website",
    year: "2025",
    client: "Personal Project",
    role: {
      EN: "Game Design & Development",
      ID: "Desain & Pengembangan Game",
    },
    summary: {
      EN: "2D arcade badminton championship built on HTML5 Canvas featuring authentic high-drag shuttlecock aerodynamics, responsive jump-smashes, and tournament AI.",
      ID: "Game bulutangkis arcade 2D murni berbasis HTML5 Canvas dengan simulasi aerodinamika kok, jump-smash responsif, dan AI turnamen.",
    },
    description: {
      EN: "A fast-paced 2D arcade tournament game engineered directly with native HTML5 Canvas and JavaScript without external game engines. It features realistic parabolic shuttlecock aerodynamics with quadratic air resistance, responsive controls for smashes, drops, and clears, multi-round tournament AI, and procedural synth audio generated via the Web Audio API. Playable directly in the browser.",
      ID: "Game turnamen bulutangkis 2D yang dibangun langsung dengan native HTML5 Canvas dan JavaScript tanpa mesin game eksternal. Menghadirkan simulasi aerodinamika kok dengan hambatan udara realistis, kontrol responsif untuk smash, drop shot, dan lob, lawan AI turnamen, serta audio synthesizer prosedural via Web Audio API. Dapat dimainkan langsung di peramban.",
    },
    caseStudy: {
      problem: {
        EN: "Standard web-based sports games frequently rely on heavy external engines that inflate bundle size, introduce input latency, and produce floaty, unconvincing shuttlecock physics unsuited for fast reflex play.",
        ID: "Sebagian besar game arcade web bergantung pada engine pihak ketiga yang berat sehingga memperlambat waktu muat, menghasilkan simulasi lintasan kok yang kurang realistis, dan memiliki latensi kontrol yang menghambat refleks permainan kompetitif.",
      },
      trustPositioning: {
        EN: "Built from first principles using native HTML5 Canvas and procedural Web Audio API with zero external dependencies. Calibrated with authentic quadratic air-drag aerodynamic equations and deterministic hitboxes for tournament-grade precision.",
        ID: "Dibangun murni dari dasar menggunakan native HTML5 Canvas dan Web Audio API prosedural tanpa pustaka eksternal. Menerapkan formula aerodinamika dengan hambatan udara kuadratik, deteksi tabrakan presisi, dan kecerdasan buatan turnamen.",
      },
      whatChanged: {
        EN: "Engineered an instantaneous 60 FPS browser tournament experience featuring sharp parabolic smashes, dynamic drop clears, procedural synthesizer audio, and adaptive multi-tier AI opponents without downloading external assets.",
        ID: "Menghadirkan game bulutangkis berbasis peramban berkecepatan 60 FPS tanpa beban pustaka pihak ketiga, lintasan smash parabolik realistis, kontrol shot responsif, audio synthesizer prosedural, dan AI adaptif yang dapat dimainkan secara instan.",
      },
    },
    stack: ["HTML5 Canvas", "JavaScript", "Web Audio API", "Tailwind CSS"],
    heroImage: "/project/super_smash_badminton.png",
    gallery: [
      "/project/super_smash_badminton.png",
    ],
    isGame: true,
    gameUrl: "/project/super_smash_badminton_arcade.html",
    liveUrl: "/project/super_smash_badminton_arcade.html",
  },
  {
    id: "icy-goat",
    number: "02",
    title: "ICY - GOAT",
    subtitle: {
      EN: "Holiday Package Discovery & Travel Platform",
      ID: "Platform Pemesanan Paket Liburan & Travel",
    },
    category: "Website",
    categoryKey: "website",
    year: "2024",
    client: "Icy Goat Travel",
    role: {
      EN: "UI/UX Design & Web Development",
      ID: "Desain UI/UX & Pengembangan Web",
    },
    summary: {
      EN: "Curated travel agency platform offering affordable vacation packages for couples seeking simple, adventurous experiences with intuitive booking navigation.",
      ID: "Platform agen perjalanan dengan paket liburan terjangkau bagi pasangan petualang, menghadirkan kemudahan akses informasi dan navigasi intuitif.",
    },
    description: {
      EN: "User interface and user experience (UI/UX) design and frontend web development for Icy Goat, a travel agency platform offering affordable vacation packages. The project centers on couples seeking simple, memorable, yet adventurous travel experiences. The design prioritizes immediate access to destination details, transparent itineraries, and a clean, visually inspiring layout.",
      ID: "Desain antarmuka (UI/UX) dan pengembangan website untuk Icy Goat, platform agen perjalanan dengan paket liburan terjangkau. Proyek ini berfokus pada pasangan yang mencari liburan praktis dan berkesan. Desain mengutamakan kemudahan akses informasi destinasi, transparansi jadwal, dan tata visual yang menginspirasi.",
    },
    caseStudy: {
      problem: {
        EN: "Boutique travel platforms often suffer from cluttered pricing schemes, hidden itinerary fees, and intimidating booking forms that confuse visiting couples and hinder trip conversions.",
        ID: "Agen perjalanan sering kehilangan calon pelanggan akibat tabel harga yang membingungkan, jadwal perjalanan yang tidak transparan, dan formulir pemesanan berbelit-belit yang memicu kelelahan kognitif pada pasangan yang mencari liburan praktis.",
      },
      trustPositioning: {
        EN: "Positioned Icy Goat as a trusted, adventure-first travel agency for couples through candid destination photography, upfront all-inclusive pricing, and detailed day-by-day itineraries that build immediate booking confidence.",
        ID: "Memposisikan Icy Goat sebagai agen perjalanan terpercaya untuk pasangan petualang modern melalui penyajian rincian fasilitas terbuka, jadwal harian transparan, dan narasi destinasi yang menginspirasi.",
      },
      whatChanged: {
        EN: "Designed an editorial, high-clarity booking interface that highlights romantic excursion packages, clarifies daily logistics, and reduces inquiry steps to a single low-friction modal flow.",
        ID: "Mengubah alur pemesanan menjadi aplikasi web editorial yang ringkas dengan kartu destinasi interaktif, rincian jadwal harian yang mudah dipahami, transparansi total biaya per pasangan, dan formulir konsultasi cepat tanpa friksi.",
      },
    },
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Vercel"],
    heroImage: "https://framerusercontent.com/images/izIVdmfjSIdiFDc4RGeoLvvun0.jpg?width=4786&height=3961",
    gallery: [
      "https://framerusercontent.com/images/izIVdmfjSIdiFDc4RGeoLvvun0.jpg?width=4786&height=3961",
      "https://framerusercontent.com/images/ZJKXnIoIuHU2IFYkjCYEUljwWmg.jpg?width=1440&height=900",
    ],
    liveUrl: "https://icy-goat.vercel.app/",
    sourceUrl: "https://danielkurnia.framer.website/work/icy-goat-dev/program",
  },
  {
    id: "kabaabs",
    number: "03",
    title: "Kabaabs",
    subtitle: {
      EN: "Street Food Ordering & Culinary Brand Experience",
      ID: "Aplikasi Pemesanan Kuliner Kebab Street Food",
    },
    category: "Website",
    categoryKey: "website",
    year: "2026",
    client: "Kabaabs F&B",
    role: {
      EN: "UI/UX Design & Fullstack Development",
      ID: "Desain UI/UX & Pengembangan Fullstack",
    },
    summary: {
      EN: "Culinary ordering web application for a street food kebab restaurant, engineered for swift menu exploration, low-latency cart state, and effortless ordering.",
      ID: "Aplikasi pemesanan kuliner restoran kebab street food yang dirancang untuk eksplorasi menu cepat, keranjang belanja responsif, dan pemesanan praktis.",
    },
    description: {
      EN: "UI/UX design and web development for a street food kebab restaurant platform. Built for young adults, students, and busy customers looking for fast, quality meals. The interface emphasizes fresh food photography, intuitive category navigation, and a frictionless cart flow that makes ordering quick and effortless.",
      ID: "Desain UI/UX dan pengembangan website untuk platform restoran kebab street food. Dibuat untuk kalangan muda, mahasiswa, dan pelanggan sibuk yang menginginkan hidangan cepat saji berkualitas. Antarmuka menonjolkan foto makanan yang menggugah selera, navigasi menu intuitif, dan alur pemesanan yang ringkas.",
    },
    caseStudy: {
      problem: {
        EN: "Street food eateries suffer high commission cuts on aggregator apps, while standalone mobile websites often face steep bounce rates due to slow catalog loading, confusing sauce options, and cart drop-offs.",
        ID: "Restoran kuliner cepat saji sering terbebani komisi platform pihak ketiga, sementara situs pemesanan mandiri konvensional cenderung lambat, sulit dijelajahi di ponsel, dan menyebabkan tingkat pembatalan pesanan yang tinggi.",
      },
      trustPositioning: {
        EN: "Positioned Kabaabs as an artisan quick-service street food brand, pairing appetizing macro photography with transparent preparation times and a seamless direct-to-kitchen ordering pipeline.",
        ID: "Mengukuhkan Kabaabs sebagai jenama kuliner modern yang mengutamakan kecepatan dan kualitas rasa, dengan kanal pemesanan langsung yang dirancang khusus bagi mahasiswa dan pekerja urban yang sibuk.",
      },
      whatChanged: {
        EN: "Engineered a rapid Next.js ordering frontend with instant condiment toggles, instant client-side cart synchronization, and an accelerated 2-step checkout flow optimized for one-handed mobile orders.",
        ID: "Membangun aplikasi pemesanan berbasis Next.js yang responsif dengan fotografi hidangan menggugah selera, kustomisasi topping praktis, manajemen keranjang belanja tanpa jeda, dan alur pembayaran ringkas 2 langkah.",
      },
    },
    stack: ["React", "Next.js", "Tailwind CSS", "Node.js", "Vercel"],
    heroImage: "https://framerusercontent.com/images/tkIoxOLMI4jnsjJTPn7fBFOMOxg.jpg?width=4000&height=3000",
    gallery: [
      "https://framerusercontent.com/images/tkIoxOLMI4jnsjJTPn7fBFOMOxg.jpg?width=4000&height=3000",
      "https://framerusercontent.com/images/MpnVTM25YPvotfk6pGLiCFlLwI.jpg?width=1366&height=768",
      "https://framerusercontent.com/images/51cudVg7Xi8FkD4Fcr8FVzbmq3Q.jpg?width=1440&height=1024",
    ],
    liveUrl: "https://dlabsign-kebabs-portfolio.vercel.app/",
    sourceUrl: "https://danielkurnia.framer.website/work/kabaabs/program",
  },
  {
    id: "movie-app",
    number: "04",
    title: "Movie Ticketing Mobile App",
    subtitle: {
      EN: "Cinematic Dark Mode Ticket Booking Experience",
      ID: "Desain Aplikasi Mobile Pemesanan Tiket Bioskop",
    },
    category: "Website",
    categoryKey: "website",
    year: "2024",
    client: "Cinema Concept",
    role: {
      EN: "Mobile UI/UX Design",
      ID: "Desain UI/UX Mobile",
    },
    summary: {
      EN: "Ergonomic dark-mode mobile cinema booking application designed for low-light theater lobbies with rapid seat reservation and intuitive checkout.",
      ID: "Desain UI/UX aplikasi mobile pemesanan tiket bioskop bersuasana dark mode sinematik untuk kenyamanan visual di area temaram dan pemesanan kursi cepat.",
    },
    description: {
      EN: "Mobile UI/UX design for a cinema ticket booking application. The goal was to create a seamless journey from browsing now-showing movies to seat reservation and payment. Built with a rich dark mode palette and energetic orange accents, the interface reduces eye strain in dimly lit cinema environments while maintaining clear visual hierarchy.",
      ID: "Desain antarmuka aplikasi seluler untuk pemesanan tiket bioskop. Bertujuan menciptakan alur yang mulus mulai dari memilih film, denah kursi, hingga pembayaran. Memadukan estetika dark mode dengan aksen oranye khas untuk kenyamanan mata di ruangan bioskop yang temaram.",
    },
    caseStudy: {
      problem: {
        EN: "Standard cinema ticketing apps present stark white interfaces that cause severe glare in dimly lit cinema auditoriums, coupled with awkward seat selection charts and lengthy multipage verification.",
        ID: "Aplikasi pemesanan tiket bioskop pada umumnya memiliki antarmuka putih cerah yang menyilaukan saat digunakan di lobi temaram, serta alur pemilihan kursi yang kaku dan memperlambat proses transaksi.",
      },
      trustPositioning: {
        EN: "Positioned the application as an ergonomic, distraction-free moviegoer tool, utilizing deep OLED black aesthetics, distinct cinema audio/visual badges, and clear real-time seat availability indicators.",
        ID: "Dirancang sebagai pendamping mobile ergonomis bernuansa OLED dark mode dengan hierarki visual kontras tinggi untuk kenyamanan mata penonton dan kepastian reservasi tempat duduk secara kilat.",
      },
      whatChanged: {
        EN: "Implemented an immersive dark theme with high-visibility seating tiers, real-time spatial row previews, and a 3-tap booking flow resulting in instant digital QR code wallet passes.",
        ID: "Menghasilkan alur pengguna yang mulus dengan eksplorasi film dinamis, denah kursi interaktif dengan indikator ketersediaan real-time, serta proses checkout satu jempol yang langsung menghasilkan tiket QR digital.",
      },
    },
    stack: ["Figma", "UI/UX Design", "Mobile Prototyping", "Design System"],
    heroImage: "https://framerusercontent.com/images/wxeQMFysREBTqzNuKQCdcXWgm8.jpg?width=6000&height=4500",
    gallery: [
      "https://framerusercontent.com/images/wxeQMFysREBTqzNuKQCdcXWgm8.jpg?width=6000&height=4500",
      "https://framerusercontent.com/images/hAvp0Sp9pxZ3JgnvPEdquwOJZrE.jpg?width=4000&height=3000",
      "https://framerusercontent.com/images/JYOrXXn6mvlspHPPqnu7XKLb48o.jpg?width=4000&height=3000",
    ],
    liveUrl: "https://danielkurnia.framer.website/work/cinema-mobile-apps/program",
    sourceUrl: "https://danielkurnia.framer.website/work/cinema-mobile-apps/program",
  },
  {
    id: "smart-vending",
    number: "05",
    title: "Smart Fruit Salad & Vending Machine",
    subtitle: {
      EN: "IoT-Integrated Fresh Food Mobile Ordering System",
      ID: "Sistem Pemesanan Makanan Sehat Terintegrasi Mesin Pintar",
    },
    category: "Website",
    categoryKey: "website",
    year: "2025",
    award: "Gold Medal — Jakarta International Science Fair",
    client: "Jakarta International Science Fair",
    role: {
      EN: "Product & UI/UX Design",
      ID: "Desain Produk & UI/UX",
    },
    summary: {
      EN: "Award-winning fresh salad and juice mobile ordering system synced with smart vending hardware. Gold Medal winner at Jakarta International Science Fair.",
      ID: "Aplikasi mobile pemesanan salad buah dan jus segar terintegrasi mesin vending pintar. Meraih Medali Emas di Jakarta International Science Fair.",
    },
    description: {
      EN: "UI/UX design for a mobile application connecting fresh fruit salad and juice ordering with automated smart vending machines. Features a crisp, natural green color palette to convey freshness and wellness. Developed for the Jakarta International Science Fair, where it was awarded a Gold Medal for design innovation and user-centered interaction.",
      ID: "Desain UI/UX aplikasi seluler pemesanan salad buah dan jus segar yang terhubung dengan mesin vending pintar otomatis. Menggunakan palet hijau segar untuk menyampaikan kesan alami dan sehat. Dikembangkan untuk Jakarta International Science Fair dan berhasil meraih Medali Emas atas inovasi desain berorientasi pengguna.",
    },
    caseStudy: {
      problem: {
        EN: "Consumers hesitate to buy fresh produce and ready-to-eat salads from unattended vending machines due to concerns over ingredient spoilage, uncertain refrigeration, and lack of allergen transparency.",
        ID: "Mesin penjual makanan segar otomatis kerap menghadapi keraguan konsumen terkait kesegaran buah, kepatuhan suhu penyimpanan, serta tanggal kedaluwarsa produk di dalam dispenser otomatis.",
      },
      trustPositioning: {
        EN: "Validated by the Gold Medal jury at the Jakarta International Science Fair, the application positions automated vending as a certified, hygienic healthy food dispensary with live telemetry proof.",
        ID: "Terbukti meraih Medali Emas pada Jakarta International Science Fair melalui integrasi perangkat keras IoT dan aplikasi seluler yang menyajikan transparansi kesegaran dan standar higienitas pangan secara terverifikasi.",
      },
      whatChanged: {
        EN: "Integrated real-time IoT hardware telemetry into the app UI, displaying internal refrigeration temperatures, harvest batches, countdown timers to freshness expiry, and touchless QR-code dispensing.",
        ID: "Merancang antarmuka seluler terintegrasi yang menampilkan indikator suhu mesin real-time, waktu pengolahan batch, informasi nutrisi detail, serta kode QR pengambilan nirkontak yang terbukti meningkatkan kepercayaan pengguna.",
      },
    },
    stack: ["Figma", "Mobile UI/UX", "IoT Interaction", "Product Design"],
    heroImage: "https://framerusercontent.com/images/RQCm4RiltfekMUhcXo80ZXJD7v0.jpg?width=6000&height=4500",
    gallery: [
      "https://framerusercontent.com/images/RQCm4RiltfekMUhcXo80ZXJD7v0.jpg?width=6000&height=4500",
      "https://framerusercontent.com/images/RcpZSCUYdIJJfQoDav75dHq0yXc.jpg?width=4000&height=3000",
      "https://framerusercontent.com/images/vYr5Re5OeAONoK8ky1d2zA0x2s.jpg?width=4000&height=3000",
    ],
    liveUrl: "https://danielkurnia.framer.website/work/smart-fruit-salad-box/program",
    sourceUrl: "https://danielkurnia.framer.website/work/smart-fruit-salad-box/program",
  },
  {
    id: "sap-mdg",
    number: "06",
    title: "SAP Master Data Governance (MDG) Platform",
    subtitle: {
      EN: "Enterprise Staging Platform & Multi-Level Workflow Engine",
      ID: "Platform Tata Kelola Master Data & Alur Persetujuan Bertingkat",
    },
    category: "Website",
    categoryKey: "website",
    year: "2024",
    client: "PT Kayu Mebel Indonesia",
    role: {
      EN: "ABAP BSP Developer & Solution Architect",
      ID: "Pengembang ABAP BSP & Arsitek Solusi",
    },
    summary: {
      EN: "Enterprise SAP Master Data Governance web platform streamlining multi-level approval workflows for Material Master (MARA), Business Partner (BUT000), and Purchasing Info Records.",
      ID: "Platform web tata kelola master data enterprise berbasis SAP BSP untuk standardisasi dan alur persetujuan bertingkat Material Master, Business Partner, dan Info Record.",
    },
    description: {
      EN: "Full-lifecycle enterprise web application developed on SAP Business Server Pages (BSP) architecture for PT Kayu Mebel Indonesia. Built to govern the lifecycle of Material Master (MDG-M), Business Partner (MDG-BP), and Purchasing Info Records. The system incorporates custom SE11 staging tables, multi-level steward validation workflows, dynamic furniture BOM staging, and offline-capable JSON simulation.",
      ID: "Aplikasi enterprise siklus penuh yang dikembangkan di atas arsitektur SAP Business Server Pages (BSP) untuk PT Kayu Mebel Indonesia. Dirancang untuk mengelola tata kelola siklus hidup Material Master (MDG-M), Business Partner (MDG-BP), dan Purchasing Info Record. Sistem mengintegrasikan tabel staging kustom SE11, alur validasi bertingkat, penataan BOM furnitur dinamis, serta simulasi mandiri berbasis JSON.",
    },
    caseStudy: {
      problem: {
        EN: "At manufacturing enterprise PT Kayu Mebel Indonesia, master data creation was plagued by decentralized Excel forms, duplicate material numbers, unverified vendor bank accounts, and slow unstructured email approvals—causing supply chain disruptions and inaccurate Bill of Materials (BOM) cost calculations.",
        ID: "Pada manufaktur PT Kayu Mebel Indonesia, pengajuan master data sebelumnya terfragmentasi dalam spreadsheet Excel manual, memicu duplikasi data material, rekening vendor yang tidak tervalidasi, serta alur approval via email yang lambat dan tanpa audit trail sehingga mengganggu kalkulasi BOM dan jadwal produksi.",
      },
      trustPositioning: {
        EN: "Architected strictly according to standard SAP MDG rule-based workflow principles. Enforced custom SE11 staging structures (ZMDG_STG_HDR, ZTB_BP_REQ) and segregation of duties (Requestor, Data Steward, Bank Steward, and Approver) to guarantee 100% data compliance before execution via standard SAP BAPIs.",
        ID: "Dirancang berpedoman ketat pada prinsip rule-based workflow SAP MDG enterprise. Menerapkan tabel staging SE11 kustom (ZMDG_STG_HDR, ZTB_BP_REQ) dan pemisahan wewenang ketat (Requestor, Data Steward, Bank Steward, dan Approver) guna menjamin validitas 100% sebelum diposting ke database inti SAP via BAPI.",
      },
      whatChanged: {
        EN: "Consolidated all master data operations into a unified web portal featuring real-time wildcard search, multi-level digital approvals with immutable audit logs, dynamic timber BOM component staging, and decoupled JSON demo capability—slashing governance lead time from days to under 15 minutes.",
        ID: "Mengintegrasikan seluruh pengajuan master data ke dalam satu portal terpusat dengan pencarian wildcard real-time, persetujuan bertingkat digital berjejak audit lengkap, otomasi staging BOM komponen kayu, serta kemampuan demo mandiri berbasis JSON yang memangkas waktu proses dari hitungan hari menjadi di bawah 15 menit.",
      },
    },
    stack: ["SAP ABAP", "SAP BSP", "SAP S/4HANA", "JavaScript", "JSON Staging", "Tailwind CSS"],
    heroImage: "/project/landing-page-mdg.png",
    gallery: [
      "/project/landing-page-mdg.png",
    ],
    liveUrl: "/project/MDG/landing_page.html",
    sourceUrl: "/project/MDG/landing_page.html",
  },
  {
    id: "church-social-media",
    number: "07",
    title: "Church Social Media Design",
    subtitle: {
      EN: "Visual Communications & Community Ministry Branding",
      ID: "Desain Komunikasi Visual & Media Sosial Pelayanan",
    },
    category: "Graphic Design",
    categoryKey: "graphic-design",
    year: "2021 — Present",
    client: "GMS Sidoarjo",
    role: {
      EN: "Graphic Design & Art Direction",
      ID: "Desain Grafis & Arahan Kreatif",
    },
    summary: {
      EN: "Disciplined and expressive social media visual communications crafted to elevate ministry messaging, community outreach, and weekly event attendance.",
      ID: "Materi visual media sosial terarah dan ekspresif untuk memperkuat pesan pelayanan gereja, penjangkauan jemaat, dan kegiatan mingguan.",
    },
    description: {
      EN: "Creative graphic design and visual media production for church ministry communication and community outreach. The focus is crafting clean, engaging, and high-impact graphics that communicate service announcements, conferences, and inspirational series with clear typographic hierarchy and contemporary visual direction.",
      ID: "Perancangan desain grafis dan media visual untuk komunikasi pelayanan gereja dan penjangkauan jemaat. Berfokus pada materi visual yang bersih, menarik, dan informatif untuk jadwal ibadah mingguan, konferensi pemuda, serta kutipan inspiratif dengan hierarki tipografi yang rapi.",
    },
    caseStudy: {
      problem: {
        EN: "Church community updates and conference invitations were previously published through disparate layouts with overcrowded text and inconsistent typography, resulting in message fatigue and low turnout.",
        ID: "Komunikasi jadwal ibadah dan program pelayanan sebelumnya tersebar dengan tata visual yang tidak konsisten, teks yang terlalu padat, dan variasi gaya yang mengurangi daya tarik serta efektivitas penyampaian warta jemaat.",
      },
      trustPositioning: {
        EN: "Positioned the ministry's visual identity as dignified, modern, and inspiring. Maintained spiritual reverence while adhering to rigorous editorial design and typographic balance.",
        ID: "Merumuskan sistem komunikasi visual terpadu untuk GMS Sidoarjo yang menjaga kedalaman pesan rohani dengan standar desain grafis editorial kontemporer yang relevan bagi generasi muda dan jemaat umum.",
      },
      whatChanged: {
        EN: "Instituted a unified visual design system with defined sermon series color themes, scannable multi-slide carousel templates, and impactful pull quotes that measurably raised post reach and service attendance.",
        ID: "Menghasilkan pedoman identitas visual komprehensif, palet warna tematik per seri khotbah, format komidi putar pengumuman yang rapi, serta kutipan inspiratif yang secara nyata meningkatkan interaksi media sosial dan partisipasi ibadah.",
      },
    },
    stack: ["Adobe Photoshop", "Adobe Illustrator", "Typography", "Visual Branding"],
    heroImage: "https://framerusercontent.com/images/4ugDBh00HgHah2oSVDUtJw2M.jpg?width=1080&height=1440",
    gallery: [
      "https://framerusercontent.com/images/4ugDBh00HgHah2oSVDUtJw2M.jpg?width=1080&height=1440",
      "https://framerusercontent.com/images/DdrKXCFcZugVGY6yMscIYFxzs34.jpg?width=1080&height=1440",
      "https://framerusercontent.com/images/mSnKIG3JlaBSjOAaRwXDNYIOI8k.webp?width=1080&height=1350",
      "https://framerusercontent.com/images/kBfLzDR8Wr6tUD50nwpX5NaSbL4.jpg?width=1080&height=1349",
      "https://framerusercontent.com/images/LWrqjA98Far95CqQieyhDsWzknE.webp?width=1080&height=1350",
    ],
    liveUrl: "https://danielkurnia.framer.website/work/gms-sidoarjo/design",
    sourceUrl: "https://danielkurnia.framer.website/work/gms-sidoarjo/design",
  },
  {
    id: "kedai-nihao",
    number: "08",
    title: "Kedai Nihao",
    subtitle: {
      EN: "Promotional Poster Series & Brand Identity",
      ID: "Identitas Jenama & Rangkaian Poster Promosi",
    },
    category: "Graphic Design",
    categoryKey: "graphic-design",
    year: "2026",
    client: "Kedai Nihao (collab. Persona Creative Agency)",
    role: {
      EN: "Brand & Graphic Design",
      ID: "Desain Jenama & Grafis",
    },
    summary: {
      EN: "Comprehensive visual branding, artistic promotional posters, and editorial identity created in collaboration with Persona Creative Agency for Kedai Nihao.",
      ID: "Sistem identitas visual terpadu, poster promosi artistik, dan estetika jenama hasil kolaborasi bersama Persona Creative Agency untuk Kedai Nihao.",
    },
    description: {
      EN: "In collaboration with Persona Creative Agency, developed a distinctive brand visual system and promotional poster series for hospitality brand Kedai Nihao. The assets blend retro-modern Asian typography, rich duotone color harmonies, and bold graphic compositions across in-store and digital channels.",
      ID: "Hasil kolaborasi bersama Persona Creative Agency untuk merancang sistem visual jenama dan rangkaian poster promosi Kedai Nihao. Memadukan tipografi Asia bergaya retro-modern, harmoni warna duotone yang kaya, dan tata letak grafis yang dinamis untuk media cetak maupun digital.",
    },
    caseStudy: {
      problem: {
        EN: "Emerging Asian culinary businesses struggle to differentiate in competitive food districts, often relying on generic stock templates that fail to build strong brand equity or communicate heritage.",
        ID: "Di tengah persaingan ketat bisnis kuliner perkotaan, kedai makanan baru sering tenggelam karena materi promosi yang generik dan tidak memiliki keunikan karakter visual yang mampu menarik perhatian pengunjung.",
      },
      trustPositioning: {
        EN: "Positioned Kedai Nihao as a culturally rooted yet contemporary culinary destination, blending nostalgic retro Asian visual motifs with modern high-contrast design.",
        ID: "Berkolaborasi dengan Persona Creative Agency untuk membangun karakter jenama kedai yang autentik dengan memadukan tipografi oriental klasik dan sentuhan grafis urban kontemporer yang berkarakter kuat.",
      },
      whatChanged: {
        EN: "Produced an evocative promotional poster suite, in-store visual collateral, and social media assets using a custom duotone palette and custom typography, driving strong social shares and walk-in patrons.",
        ID: "Menciptakan rangkaian poster promosi artistik, materi visual gerai, dan identitas jenama terpadu dengan palet duotone kontras tinggi yang sukses mendongkrak daya ingat jenama serta kunjungan pelanggan.",
      },
    },
    stack: ["Adobe Illustrator", "Adobe Photoshop", "Brand Identity", "Poster Art"],
    heroImage: "https://framerusercontent.com/images/xHTI54oaPCIGyuQyOrMXLE4zcms.jpg?width=1471&height=1080",
    gallery: [
      "https://framerusercontent.com/images/xHTI54oaPCIGyuQyOrMXLE4zcms.jpg?width=1471&height=1080",
      "https://framerusercontent.com/images/1bI0Zm9Jy1QOk1E26pI3BYyrM.jpg?width=864&height=1080",
      "https://framerusercontent.com/images/GIF8pgpFd1F6sY3nfLLhL6rerI.jpg?width=864&height=1080",
      "https://framerusercontent.com/images/7FOyXYSC3AmgtsYWsfL5UrzjNlU.jpg?width=864&height=1080",
      "https://framerusercontent.com/images/UHPcvrZesTIX3Jj9rglLnuG0Dck.jpg?width=864&height=1080",
      "https://framerusercontent.com/images/Hi5wVAmatXzp3MwUY8gjpipoc.jpg?width=864&height=1080",
    ],
    liveUrl: "https://danielkurnia.framer.website/work/kedai-nihao/design",
    sourceUrl: "https://danielkurnia.framer.website/work/kedai-nihao/design",
  },
];

export function getProjectBySlug(slug: string): DetailedProject | undefined {
  return DETAILED_PROJECTS.find((p) => p.id === slug);
}

export function getAllProjectSlugs(): string[] {
  return DETAILED_PROJECTS.map((p) => p.id);
}
