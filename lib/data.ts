export interface SkillItem {
  name: string;
  icon: string;
}

export interface SkillCategory {
  category: string;
  sub: string;
  code: string;
  items: SkillItem[];
}

export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  year: string;
  image: string;
  link: string;
  summary: string;
  client?: string;
  metrics?: string;
  badge?: string;
  stack?: string[];
  role?: string;
  fullDescription?: string;
  highlights?: string[];
}

export interface Experience {
  period: string;
  role: string;
  company: string;
  location: string;
  type?: string;
  badge: string;
  deliverables: string[];
  description: string;
  tags: string[];
  achievements?: string[];
  skills?: string[];
}

export interface SocialLink {
  name: string;
  label: string;
  url: string;
  shortCode: string;
}

export const DANIEL_PROFILE = {
  name: "daniel kurnia",
  firstName: "daniel",
  lastName: "kurnia",
  handle: "@danielkuptr",
  brand: "dlabsign.ID",
  period: "(2021 - 2026)",
  location: "Indonesia",
  email: "danielkurnip02@gmail.com",
  whatsapp: "https://wa.me/+6281259321453",
  whatsappLabel: "+62 812-5932-1453",
  framerSite: "https://danielkurnia.framer.website/",
  portraitUrl: "https://framerusercontent.com/images/rDQu4oPIdIpYY3CTR2r5V6hhnc.png?width=2315&height=4831",
  statement:
    "BASED IN INDONESIA, I AM AN INNOVATIVE DEVELOPER AND DIGITAL CREATOR. MY PASSION FOR BUILDING INTUITIVE APPLICATIONS, CLEAN INTERFACES, AND EFFICIENT SYSTEMS IS REFLECTED IN MY WORK.",
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "Instagram",
    label: "Instagram",
    url: "https://www.instagram.com/danielkuptr/",
    shortCode: "IG",
  },
  {
    name: "Github",
    label: "Github",
    url: "https://github.com/Dlabsign",
    shortCode: "GH",
  },
  {
    name: "behance",
    label: "Behance",
    url: "https://www.behance.net/dlabsignid",
    shortCode: "BE",
  },
  {
    name: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/danielkurniaputra/",
    shortCode: "LKDN",
  },
];

export const PROJECTS_DATA: Project[] = [
  {
    id: "super-smash-badminton",
    number: "00",
    title: "Super Smash Badminton Arcade",
    category: "GAME DEVELOPMENT",
    year: "2025",
    image: "/project/super_smash_badminton.png",
    link: "/project/super_smash_badminton_arcade.html",
    summary: "2D arcade badminton championship featuring high-drag shuttlecock physics, responsive jump-smashes, and tournament AI.",
    badge: "ARCADE GAME",
    client: "Personal Project",
    stack: ["HTML5 Canvas", "JavaScript", "Web Audio API", "Tailwind CSS"],
  },
  {
    id: "type-racing-stadium",
    number: "01",
    title: "Type Racing Stadium Edition",
    category: "GAME DEVELOPMENT",
    year: "2025",
    image: "/project/type_racing_stadium.png",
    link: "/project/type_racing_stadium_edition.html",
    summary: "Fast-paced arcade stadium typing race featuring animated sprinters, dynamic lane physics, procedural crowd cheers, and real-time WPM tracking.",
    badge: "TYPING GAME",
    client: "Personal Project",
    stack: ["HTML5", "CSS3 Animation", "JavaScript", "Web Audio API"],
  },
  {
    id: "kabaabs",
    number: "01",
    title: "Kabaabs",
    category: "WEB DEVELOPMENT",
    year: "2025",
    image: "https://framerusercontent.com/images/tkIoxOLMI4jnsjJTPn7fBFOMOxg.jpg?width=4000&height=3000",
    link: "https://danielkurnia.framer.website/work/kabaabs/program",
    summary: "Culinary digital ordering web application and brand experience with fluid motion.",
    badge: "WEB DEV",
    client: "Kabaabs F&B",
    stack: ["React", "Next.js", "Tailwind CSS", "Node.js"],
  },
  {
    id: "icy-goat",
    number: "02",
    title: "ICY - GOAT",
    category: "WEB DEVELOPMENT",
    year: "2025",
    image: "https://framerusercontent.com/images/izIVdmfjSIdiFDc4RGeoLvvun0.jpg?width=4786&height=3961",
    link: "https://danielkurnia.framer.website/work/icy-goat-dev/program",
    summary: "Avant-garde streetwear web platform featuring editorial lookbooks and collection drops.",
    badge: "ECOMMERCE",
    client: "ICY GOAT Apparel",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    id: "kedai-nihao",
    number: "03",
    title: "Kedai Nihao",
    category: "2026 • DESIGN & SYSTEM",
    year: "2026",
    image: "https://framerusercontent.com/images/xHTI54oaPCIGyuQyOrMXLE4zcms.jpg?width=1471&height=1080",
    link: "https://danielkurnia.framer.website/work/kedai-nihao/design",
    summary: "Next-generation hospitality digital ecosystem and interactive menu discovery.",
    badge: "UI/UX & WEB",
    client: "Kedai Nihao",
    stack: ["Figma", "React", "Next.js", "Tailwind CSS"],
  },
  {
    id: "jks-sidoarjo",
    number: "04",
    title: "JKS SIDOARJO",
    category: "2021 • WEB PLATFORM",
    year: "2021",
    image: "https://framerusercontent.com/images/zIy6KqqupYzYupk7A8RLW2c1b5Y.jpg?width=5482&height=4024",
    link: "https://danielkurnia.framer.website/work/2021/design",
    summary: "Regional organization portal featuring structured database architecture and member management.",
    badge: "PLATFORM",
    client: "JKS Sidoarjo",
    stack: ["PHP", "Laravel", "MySQL", "Bootstrap"],
  },
  {
    id: "sap-mdg",
    number: "05",
    title: "SAP MDG Platform",
    category: "2024 • ENTERPRISE PLATFORM",
    year: "2024",
    image: "/project/landing-page-mdg.png",
    link: "/projects/sap-mdg",
    summary: "Full-lifecycle enterprise SAP Master Data Governance web application streamlining multi-level approval workflows for Material Master, Business Partner, and Purchasing Info Records.",
    badge: "ENTERPRISE",
    client: "PT Kayu Mebel Indonesia",
    stack: ["SAP ABAP", "SAP BSP", "SAP S/4HANA", "Tailwind CSS"],
  },
];

export const SKILLS_CATEGORIES: SkillCategory[] = [
  {
    category: "PROGRAM LANGUAGE",
    sub: "DEVELOPMENT",
    code: "01",
    items: [
      { name: "php", icon: "https://framerusercontent.com/images/qHaQ6hG2UUzafPmjzQDK8DDJQ.svg?width=800&height=800" },
      { name: "c++", icon: "https://framerusercontent.com/images/eUIvW3E8Y7IDEq9QxBproyfnXg.svg?width=306&height=344" },
      { name: "JAVASCRIPT", icon: "https://framerusercontent.com/images/Seog1APXKgzIJqMr81huRGm8WKU.svg?width=128&height=128" },
      { name: "python", icon: "https://framerusercontent.com/images/UnujG2NSXarWnYIWt5xTIPn5Y.svg?width=800&height=800" },
      { name: "dart", icon: "https://framerusercontent.com/images/JjBGFL2ycKun4aGQGVkMe9QRf0.svg?width=800&height=800" },
      { name: "java", icon: "https://framerusercontent.com/images/LhZ7Htdj5lJ1Gj5FfRoxthM7bJg.svg?width=800&height=800" },
    ],
  },
  {
    category: "FRONT END",
    sub: "DEVELOPMENT",
    code: "02",
    items: [
      { name: "HTML", icon: "https://framerusercontent.com/images/QUMZjLBEaefCugbhkaTAFcprOWQ.svg?width=128&height=128" },
      { name: "css", icon: "https://framerusercontent.com/images/XeZZFnkmYUE1m8hRP5sSZD0KeYc.svg?width=128&height=128" },
      { name: "react", icon: "https://framerusercontent.com/images/P3zuEyXCUpaz8rgREbXcAUtB1Q.svg?width=128&height=128" },
      { name: "next.js", icon: "https://framerusercontent.com/images/pLcFcRk8XsgqFEvvT12GQ8B5bvI.svg?width=128&height=128" },
      { name: "tailwindcss", icon: "https://framerusercontent.com/images/oAnADyY5B8d4zGQDaAmCwFRiQA.svg?width=64&height=64" },
      { name: "bootstrap", icon: "https://framerusercontent.com/images/J1jNAX54YUWWsbofePSULnsihlw.svg?width=128&height=128" },
      { name: "GASP", icon: "https://framerusercontent.com/images/hasdjmtndVddj62CnsW4rd3u8M0.svg?width=100&height=100" },
      { name: "react spring", icon: "https://framerusercontent.com/images/xlgemfWaIrTzT7qCyiBcrfwJyOs.svg?width=800&height=800" },
    ],
  },
  {
    category: "BACKEND",
    sub: "DEVELOPMENT",
    code: "03",
    items: [
      { name: "laravel", icon: "https://framerusercontent.com/images/GrPXaUX0go3esgdhnHX8FgYuk.svg?width=512&height=512" },
      { name: "yii 2", icon: "https://framerusercontent.com/images/dsJ4BYlKOQd1my4BBBA0oTHy0.svg?width=800&height=800" },
      { name: "node.js", icon: "https://framerusercontent.com/images/4i4XiTIWyDdtPaiJuTWx7qj9so.svg?width=128&height=128" },
      { name: "express.js", icon: "https://framerusercontent.com/images/5wr2jgtSpIXHzwhlvF7lW8C7s.svg?width=3333&height=3333" },
      { name: "codeigniter", icon: "https://framerusercontent.com/images/j9UD1HSFepMoSk8A2bs2wjMJao.svg?width=128&height=128" },
    ],
  },
  {
    category: "DATABASE",
    sub: "SERVER",
    code: "04",
    items: [
      { name: "mysql", icon: "https://framerusercontent.com/images/Xr4iFfu02QwrVWWkNEZFoBFEC0g.svg?width=800&height=800" },
      { name: "firebase", icon: "https://framerusercontent.com/images/yKwT8jZ56nDBszswkpepPDktk.svg?width=128&height=128" },
      { name: "mongodb", icon: "https://framerusercontent.com/images/scqPe8LVb9QHnjLxrEoPrxKDOU.svg?width=128&height=128" },
    ],
  },
  {
    category: "DESIGN & SUPPORT TOOLS",
    sub: "CREATIVE SUITE",
    code: "05",
    items: [
      { name: "figma", icon: "https://framerusercontent.com/images/ebdMb8YPzflQNtu8vEMt8L2lg9Q.svg?width=800&height=800" },
      { name: "capcut", icon: "https://framerusercontent.com/images/XLMx0XliRMzucXovJJ3UY2wQhE.svg?width=3333&height=3333" },
      { name: "adobe photoshop", icon: "https://framerusercontent.com/images/BKnTN5JmJ5vXvdpeWDq3RhtgUY.svg?width=800&height=800" },
      { name: "adobe illustrator", icon: "https://framerusercontent.com/images/9ND2QPF3z3SZz77w2OZjE8ar0.svg?width=800&height=800" },
      { name: "adobe premiere", icon: "https://framerusercontent.com/images/aWt8S2FAJgVYqnvJDNFMiOU1tI.svg?width=800&height=800" },
      { name: "adobe after effects", icon: "https://framerusercontent.com/images/n8HlGHngEdFhoDFw0V84CInOSA.svg?width=800&height=800" },
    ],
  },
  {
    category: "PROGRAMMING TOOLS",
    sub: "TOOLING & DEVOPS",
    code: "06",
    items: [
      { name: "visual studio", icon: "https://framerusercontent.com/images/jQibkhgrNwnVTRSI6oOkoDwWfY.svg?width=800&height=800" },
      { name: "google colab", icon: "https://framerusercontent.com/images/a2QUcelKWMltn2xsSF2Rrd2xaCg.svg?width=56&height=56" },
      { name: "vercel", icon: "https://framerusercontent.com/images/fOaJZHPe7SWUPqG6JH07VYEOEIA.svg?width=3333&height=3333" },
      { name: "cpanel", icon: "https://framerusercontent.com/images/MyT4gl5GQU8nDqiBs2GPLEIxas.svg?width=512&height=114" },
      { name: "github", icon: "https://framerusercontent.com/images/CfMosRXNOOZwuDt4g7zwsR2CFQ.svg?width=3333&height=3333" },
      { name: "laragon", icon: "https://framerusercontent.com/images/DHOCP0bEBbfmXwVmb5by2HpEVI.svg?width=2500&height=2217" },
      { name: "xampp", icon: "https://framerusercontent.com/images/6apEUFS1iTtpvSIPHNhIlJzHXnE.svg?width=800&height=800" },
    ],
  },
];

export const EXPERIENCES_DATA: Experience[] = [
  {
    period: "Apr 2026 — Present",
    role: "Fullstack Developer",
    company: "PT. Kayu Mebel Indonesia",
    location: "Sidoarjo, Indonesia",
    badge: "FULL-TIME",
    type: "Full-time",
    description: "Architecting and developing enterprise fullstack systems, ERP integration workflows, and internal manufacturing business portals.",
    deliverables: [
      "Enterprise manufacturing workflows and portal modules",
      "Fullstack integration with database architecture and enterprise systems",
    ],
    tags: ["Fullstack", "Enterprise Systems", "Web Development", "Databases"],
    skills: ["Fullstack", "TypeScript", "ERP", "Database Architecture"],
  },
  {
    period: "Feb 2025 — Present",
    role: "FullStack Developer",
    company: "Zero One",
    location: "Surabaya, Indonesia",
    badge: "PART-TIME",
    type: "Part-time",
    description: "Building robust client web applications, responsive frontend interfaces, and scalable RESTful API integrations.",
    deliverables: [
      "Client web applications with high-fidelity UI",
      "RESTful API architectures and database integrations",
    ],
    tags: ["Next.js", "React", "Node.js", "REST APIs"],
    skills: ["Next.js", "React", "Node.js", "TypeScript"],
  },
  {
    period: "Dec 2021 — Present",
    role: "Graphic Designer & Digital Creator",
    company: "dlabsign",
    location: "Indonesia (Remote)",
    badge: "FREELANCE",
    type: "Freelance / Studio",
    description: "Delivering brand identities, high-fidelity UI design systems, visual assets, and custom design solutions for clients.",
    deliverables: [
      "End-to-end brand identity systems and digital styleguides",
      "User interface design and design system tokens in Figma",
    ],
    tags: ["Branding", "UI/UX", "Figma", "Digital Design"],
    skills: ["Figma", "Photoshop", "Illustrator", "Brand Identity"],
  },
  {
    period: "Mar 2025 — Jan 2026",
    role: "Backend Developer",
    company: "Pemancingan Tanggul Rejo",
    location: "Sidoarjo, Indonesia",
    badge: "FREELANCE",
    type: "Freelance",
    description: "Engineered database architecture, order processing workflows, and backend operational management systems.",
    deliverables: [
      "Relational database schemas and inventory management workflows",
      "Operational backend APIs and transactional integrity checks",
    ],
    tags: ["Backend", "Database", "PHP", "APIs"],
    skills: ["PHP", "MySQL", "Backend Architecture"],
  },
  {
    period: "Mar 2024 — Jan 2026",
    role: "Laboratory Assistant",
    company: "Universitas 17 Agustus 1945 Surabaya",
    location: "Surabaya, Indonesia",
    badge: "PART-TIME",
    type: "Part-time",
    description: "Mentored undergraduate engineering students in C++, Python, algorithms, database systems, and software engineering practicums.",
    deliverables: [
      "Conducted weekly practical laboratory modules for undergraduate engineers",
      "Assessed programming assignments and assisted in curriculum labs",
    ],
    tags: ["Academic", "C++", "Python", "Databases", "Mentorship"],
    skills: ["C++", "Python", "Algorithms", "Mentorship"],
  },
  {
    period: "Mar 2025",
    role: "PIC • Army of God Conference 2025",
    company: "GMS Sidoarjo",
    location: "Sidoarjo, Indonesia",
    badge: "EVENT PIC",
    type: "Event PIC",
    description: "Supervised media production, event technology coordination, and multimedia stage visual logistics for large youth conference.",
    deliverables: [
      "Live visual and stage technology operation planning",
      "Media coordination and conference visual asset deployment",
    ],
    tags: ["Event Production", "Media Logistics", "Leadership"],
    skills: ["Leadership", "Multimedia", "Event Coordination"],
  },
  {
    period: "Feb 2022",
    role: "PIC • Batch Graphic Design & Video",
    company: "SMK Antartika 2 Sidoarjo",
    location: "Sidoarjo, Indonesia",
    badge: "PROJECT PIC",
    type: "Project PIC",
    description: "Coordinated creative multimedia batch training, student workshops, and graphic design/video curriculum delivery.",
    deliverables: [
      "Trained student cohorts in digital graphic design principles",
      "Delivered practical video editing workflows and creative workshops",
    ],
    tags: ["Education", "Design Training", "Video Production"],
    skills: ["Graphic Design", "Video Editing", "Workshop Facilitation"],
  },
  {
    period: "Jan 2021",
    role: "Graphic Design Volunteer PIC",
    company: "Sidoarjo School Festival - SMK",
    location: "Sidoarjo, Indonesia",
    badge: "VOLUNTEER PIC",
    type: "Volunteer PIC",
    description: "Directed festival visual branding, print collaterals, promotional banners, and social campaign assets.",
    deliverables: [
      "Complete festival print collateral package and stage banners",
      "Promotional social media assets and branding system",
    ],
    tags: ["Volunteer", "Event Branding", "Print Design"],
    skills: ["Branding", "Print Design", "Creative Direction"],
  },
];

export interface LegacySkillGroup {
  category: string;
  items: string[];
}

export const SKILLS_DATA: LegacySkillGroup[] = [
  {
    category: "Languages & Frameworks",
    items: ["PHP", "JavaScript", "Python", "C++", "Dart", "Java", "React", "Next.js", "Tailwind CSS", "Laravel"],
  },
  {
    category: "Databases & Tools",
    items: ["MySQL", "Firebase", "MongoDB", "Figma", "VS Code", "Git", "GitHub"],
  },
];

