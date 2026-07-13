import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const display = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Handcrafted Walnut Head Football Figures`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "bespoke football walnut head models",
    "hand-crafted football models",
    "custom football memorabilia",
    "unique football gifts",
    "1990s football collectibles",
  ],
  icons: {
    icon: site.logo,
    apple: site.logo,
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} | Handcrafted Walnut Head Football Figures`,
    description: site.description,
    images: [site.logo],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}${site.logo}`,
    description: site.description,
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Wakefield",
      addressRegion: "West Yorkshire",
      addressCountry: "GB",
    },
  };

  return (
    <html lang="en-GB" className={`${display.variable} ${sans.variable}`}>
      <body>
        <Providers>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </body>
    </html>
  );
}
