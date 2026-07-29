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
    accent: "#D6A84F",
    accentSecondary: "#4F7CFF",
    categoryLabel: "DESKTOP SOFTWARE",
    description:
      "A desktop-first operating system for diamond businesses that unifies inventory, purchases, sales, accounting, reporting and daily office workflows.",
    impact:
      "Unifies inventory, purchases, sales, accounting and reporting into one connected platform for diamond businesses.",
    technologies: ["React", "TypeScript", "FastAPI", "Python", "PostgreSQL", "Tauri"],
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
    whatIBuilt:
      "I built a desktop-first business operating system designed specifically for diamond businesses. It brings inventory, purchases, sales, customer and supplier records, accounting workflows, approvals, reports, documents, users and business settings into one connected platform.",
    whyIBuiltIt:
      "Diamond offices often rely on separate spreadsheets, accounting tools, handwritten processes and disconnected software. This creates repeated data entry, poor visibility and a steep learning curve for traditional business owners. I built Carat Business OS to make the complete office easier to operate through guided workflows, clear business language and one unified source of information.",
    includes: [
      "Diamond inventory and stock tracking",
      "Purchase and sales workflows",
      "Customer and supplier management",
      "Collections, payments, receivables and payables",
      "Accounting and ledger workflows",
      "Business dashboards and reporting",
      "Approvals and activity tracking",
      "User roles and permissions",
      "Document generation",
      "Import and export workflows",
      "Backup and restore management",
      "Multi-user local network support",
      "Offline-first desktop operation",
      "Licensing and activation foundation",
    ],
    howIBuiltIt:
      "I designed the product architecture, business workflows, data model, APIs, permissions, desktop experience and operational logic. The product was built as a full-stack system rather than a visual prototype.",
    techStack: {
      Frontend: ["React", "TypeScript", "Vite"],
      Desktop: ["Tauri"],
      Backend: ["FastAPI", "Python", "SQLAlchemy", "Alembic"],
      Database: ["PostgreSQL"],
      "Architecture & Infrastructure": [
        "REST APIs",
        "Role-based access control",
        "Local network architecture",
        "Offline-first desktop architecture",
        "Database migrations",
        "Automated testing",
        "Docker for supporting services",
      ],
    },
  },
  {
    id: "business-mobile",
    title: "Carat Mobile",
    status: "In Development",
    detailVariant: "mobile-split",
    accent: "#D6A84F",
    accentSecondary: "#4F7CFF",
    categoryLabel: "MOBILE APPLICATION",
    description:
      "An owner-focused companion app for monitoring business activity, reviewing reports and handling approvals away from the office.",
    impact:
      "Keeps business owners connected to operations with dashboards, reports and approvals from anywhere.",
    technologies: ["React Native", "Expo", "TypeScript", "REST APIs", "FastAPI"],
    category: "software",
    folder: "Carat Mobile",
    images: [
      "dashboard.webp",
      "reports.webp",
      "activity.webp",
      "approval.webp",
      "dark.webp",
    ],
    cardPreview: {
      center: "dashboard.webp",
      left: "activity.webp",
      right: "reports.webp",
    },
    whatIBuilt:
      "I built a mobile companion for Carat Business OS focused on business owners rather than employees. It gives owners access to dashboards, reports, approvals and recent business activity without requiring them to remain at their office computer.",
    whyIBuiltIt:
      "Business owners often leave the office but still need visibility into collections, payments, approvals, sales and daily activity. Carat Mobile was created to keep the owner connected to important decisions while the desktop system continues running the business inside the office.",
    includes: [
      "Owner dashboard",
      "Business summaries",
      "Reports",
      "Approval workflows",
      "Activity timeline",
      "Collections and payment visibility",
      "Operational alerts and pending actions",
      "Light and dark interface support",
      "Secure connection to the Carat platform",
      "Mobile entitlement and access controls",
    ],
    howIBuiltIt:
      "I designed the mobile information architecture, owner workflows, API integration, authentication flow, approval experience, reporting views and responsive mobile interface as part of the wider Carat product ecosystem.",
    techStack: {
      Mobile: ["React Native", "Expo", "TypeScript"],
      Integration: ["REST APIs", "Secure authentication", "Shared business permissions", "Mobile entitlement controls"],
      "Backend Integration": ["FastAPI", "PostgreSQL"],
      Development: ["Component-based architecture", "Automated testing", "Responsive mobile layouts"],
    },
  },
  {
    id: "inventory-platform",
    title: "Custom Business Management Software",
    status: "Prototype",
    categoryLabel: "DESKTOP SOFTWARE",
    description:
      "Custom operational software built around a business's own inventory, records, reporting and day-to-day workflows.",
    impact:
      "Tailors operational software around a business's own processes, improving control, visibility and consistency.",
    technologies: ["React", "TypeScript", "FastAPI", "Python", "PostgreSQL"],
    category: "software",
    folder: "DP Jewels",
    images: [
      "natural-diamond.png",
      "all-stock.png",
      "all-transaction.png",
      "analytics.png",
      "bills.png",
      "party-ledger.png",
      "trading.png",
    ],
    whatIBuilt:
      "I built a custom business management platform for businesses that cannot fit their processes into generic inventory or ERP software. The system is structured around the company's own products, records, inventory movements, customers, suppliers, reports and operational workflows.",
    whyIBuiltIt:
      "Many businesses adapt their real processes to rigid software, creating unnecessary steps and confusion. This project demonstrates how I design software around the way a business already works, while improving control, visibility and consistency.",
    includes: [
      "Custom inventory workflows",
      "Product and stock records",
      "Customer and supplier management",
      "Purchase and sales operations",
      "Business reports",
      "User permissions",
      "Search and filtering",
      "Operational dashboards",
      "Configurable business data",
      "Workflow-specific interfaces",
      "Data import and export",
      "Scalable API and database foundation",
    ],
    howIBuiltIt:
      "I handled the product structure, workflow design, frontend implementation, backend APIs, database modelling and system integration. The architecture is intended to be adapted for different business requirements without rebuilding the entire foundation.",
    techStack: {
      Frontend: ["React", "TypeScript", "Vite"],
      Backend: ["FastAPI", "Python", "SQLAlchemy"],
      Database: ["PostgreSQL", "Alembic migrations"],
      Architecture: ["REST APIs", "Role-based permissions", "Modular business workflows", "Reusable component architecture"],
    },
  },
];
