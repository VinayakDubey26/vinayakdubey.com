const imageGlob = import.meta.glob("/src/assets/proof of work/**/*", {
  eager: true,
  query: "?url",
  import: "default",
});

export function getProjectImage(folder, filename) {
  const key = `/src/assets/proof of work/${folder}/${filename}`;
  return imageGlob[key] || "";
}

const isVideo = (file) => /\.(webm|mp4|mov)$/i.test(file);

export function isVideoFile(file) {
  return isVideo(file);
}

export const websiteProjects = [
  {
    id: "techno-clothing",
    title: "Techno Clothing Ecommerce",
    status: "Concept",
    categoryLabel: "FASHION ECOMMERCE",
    description:
      "A modern techno-fashion ecommerce concept blending premium streetwear presentation with immersive animated brand experiences.",
    impact:
      "Explores a bold techno-fashion shopping experience through immersive visuals and animated storytelling.",
    technologies: ["React", "GSAP", "Animation", "Responsive"],
    category: "website",
    folder: "Sinnr",
    images: [
      "homepage.png",
      "homepage-techno-styled-animation.webm",
      "collection.png",
      "night-system.png",
      "about.png",
      "pre-launch.png",
      "footer.png",
      "full-page.png",
    ],
  },
  {
    id: "carat-software",
    title: "Carat Business Website",
    status: "Live",
    liveUrl: "https://carat-software.netlify.app/",
    categoryLabel: "BUSINESS WEBSITE",
    description:
      "The official product website for Carat Business OS, designed to showcase the platform through premium storytelling, responsive design and modern interactions.",
    impact:
      "Helps businesses understand the product and generate qualified leads.",
    technologies: ["React", "TypeScript", "Vite", "GSAP"],
    category: "website",
    folder: "Carat-Website",
    images: [
      "homepage.png",
      "software-view.png",
      "visiblity.png",
      "why-carat.png",
      "why-carat-2.png",
      "mobile.png",
      "contact-us.png",
    ],
  },
  {
    id: "arivaa",
    title: "Luxury Jewellery Ecommerce",
    status: "Live",
    liveUrl: "https://arivaa-jewellery.netlify.app/",
    categoryLabel: "JEWELLERY ECOMMERCE",
    description:
      "A modern fashion ecommerce experience focused on premium branding, product discovery and responsive shopping experiences.",
    impact:
      "Provides an elegant brand experience that drives product discovery and customer trust.",
    technologies: ["React", "GSAP", "CSS", "Responsive"],
    category: "website",
    folder: "Arivaa",
    images: [
      "Homepage.png",
      "rings-showcase.webm",
      "diamond-showcase.webm",
      "our-collection.png",
      "wedding-rings.png",
      "faqs.png",
      "diamond-shapes.png",
    ],
  },
  {
    id: "dp-website",
    title: "Diamond Business Website",
    status: "Live",
    liveUrl: "https://dpjewelsdiamond.netlify.app/",
    categoryLabel: "CORPORATE WEBSITE",
    description:
      "Corporate website showcasing international diamond sourcing, certifications and business capabilities.",
    impact:
      "Establishes credibility for international diamond sourcing and certifications.",
    technologies: ["React", "GSAP", "Animation", "Responsive"],
    category: "website",
    folder: "DP Jewels Website",
    images: [
      "homepage.png",
      "requirements.png",
      "certificates.png",
      "about.png",
      "diamond-shapes.png",
      "indian-map-animation.webm",
    ],
  },
  {
    id: "shah-spices",
    title: "Food Manufacturing Website",
    status: "Built",
    categoryLabel: "BUSINESS WEBSITE",
    description:
      "Business website showcasing manufacturing processes, products and enquiry workflows for a food company.",
    impact:
      "Connects manufacturers with bulk buyers through clear process and enquiry workflows.",
    technologies: ["React", "Responsive", "B2B"],
    category: "website",
    folder: "Shah Spices",
    images: [
      "homepage.png",
      "spices.png",
      "process.png",
      "bulk-order.png",
      "contact.png",
      "bulk.png",
    ],
  },
];

export const softwareProjects = [
  {
    id: "business-os",
    title: "Carat Business OS",
    status: "In Development",
    categoryLabel: "DESKTOP SOFTWARE",
    description:
      "A desktop-first business operating system built for diamond businesses to simplify inventory, purchasing, sales, accounting, reporting and everyday operations through one unified platform.",
    impact:
      "Streamlines daily business operations from inventory to accounting in one desktop application.",
    technologies: ["Python", "SQLite", "Desktop", "Offline-first"],
    category: "software",
    folder: "Carat OS",
    images: [
      "dashboard.webp",
      "reports.webp",
      "payables.webp",
      "collections.webp",
      "purchase.webp",
      "customer-payments.webp",
      "business-activity.webp",
      "backups.webp",
      "user-roles.webp",
    ],
  },
  {
    id: "business-mobile",
    title: "Carat Mobile",
    status: "Built",
    categoryLabel: "MOBILE APPLICATION",
    description:
      "A companion mobile application designed for business owners to monitor operations, approvals, reports and business activity from anywhere.",
    impact:
      "Keeps business owners connected to their operations with real-time dashboards and approvals.",
    technologies: ["React Native", "Mobile", "Dashboard"],
    category: "software",
    folder: "Carat Mobile",
    images: [
      "dashboard.webp",
      "reports.webp",
      "activity.webp",
      "approval.webp",
      "dark.webp",
    ],
  },
  {
    id: "inventory-platform",
    title: "Custom Business Management Software",
    status: "Prototype",
    categoryLabel: "DESKTOP SOFTWARE",
    description:
      "Custom-built business software tailored for operational workflows, inventory management, reporting and day-to-day business processes.",
    impact:
      "Simplifies inventory tracking and reporting for small to medium businesses.",
    technologies: ["Python", "SQLite", "Desktop"],
    category: "software",
    folder: "DP Jewels",
    images: [
      "all-stock.png",
      "all-transaction.png",
      "analytics.png",
      "bills.png",
      "natural-diamond.png",
      "party-ledger.png",
      "trading.png",
    ],
  },
];
