export const site = {
  name: "Walnutterz",
  tagline: "The Original Walnut Head Football Figures: Reborn with a Twist",
  logo: "/assets/brand/walnutterz-logo.png",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Bespoke, hand-crafted and hand-painted walnut head football figures. Unique collectibles and gifts celebrating the players, clubs and moments that shaped the beautiful game.",
  email: "l2eev@yahoo.co.uk",
  phone: "07767 027682",
  location: "Wakefield WF1, UK",
  social: {
    tiktok: "https://www.tiktok.com/",
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
  },
};

export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href?: string; children?: NavChild[] };

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  {
    label: "Models",
    children: [
      { label: "Our Models", href: "/our-models" },
      { label: "Custom Orders", href: "/custom-orders" },
      { label: "Design Your Own", href: "/design-your-own" },
      { label: "Gift Finder", href: "/gift-finder" },
      { label: "Quick Turnaround", href: "/quick-turnaround" },
    ],
  },
  {
    label: "Community",
    children: [
      { label: "The Football Time Tunnel", href: "/time-tunnel" },
      { label: "The Making of a Walnutterz", href: "/making-of" },
      { label: "Meet the Maker", href: "/meet-the-maker" },
      { label: "Customer Gallery", href: "/gallery" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    label: "About",
    children: [
      { label: "About Walnutterz", href: "/about-us" },
      { label: "Why Walnut?", href: "/why-walnut" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
  { label: "Contact", href: "/contact-us" },
];

// Flat list used for the footer and sitemap generation.
export const footerNav: NavChild[] = [
  { label: "Shop", href: "/shop" },
  { label: "Our Models", href: "/our-models" },
  { label: "Custom Orders", href: "/custom-orders" },
  { label: "Design Your Own", href: "/design-your-own" },
  { label: "Gift Finder", href: "/gift-finder" },
  { label: "Time Tunnel", href: "/time-tunnel" },
  { label: "Meet the Maker", href: "/meet-the-maker" },
  { label: "Making Of", href: "/making-of" },
  { label: "Customer Gallery", href: "/gallery" },
  { label: "About", href: "/about-us" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Blog", href: "/blog" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact", href: "/contact-us" },
];

export const GIFT_OCCASIONS = [
  "Birthday",
  "Father's Day",
  "Christmas",
  "Retirement",
  "Coach Gift",
  "Player of the Match",
  "Football Club Awards",
];

export const GALLERY_CATEGORIES = [
  "Football rooms",
  "Home bars",
  "Man caves",
  "Trophy cabinets",
  "Children's bedrooms",
  "Clubhouses",
];

export const DECADES = ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s"];
