import Link from "next/link";
import Image from "next/image";
import { footerNav, site } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 bg-heading text-cream">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="inline-flex rounded-xl bg-white/95 p-2">
            <Image src={site.logo} alt="Walnutterz" width={110} height={73} className="h-auto w-[100px]" />
          </div>
          <p className="mt-4 text-sm text-cream/80">{site.tagline}</p>
          <div className="mt-4 flex gap-3">
            <SocialLink href={site.social.tiktok} label="TikTok">TT</SocialLink>
            <SocialLink href={site.social.instagram} label="Instagram">IG</SocialLink>
            <SocialLink href={site.social.facebook} label="Facebook">f</SocialLink>
          </div>
        </div>

        <div>
          <h3 className="text-cream text-sm font-bold uppercase tracking-wider">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {footerNav.slice(0, 7).map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-cream/80 hover:text-accent">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-cream text-sm font-bold uppercase tracking-wider">Discover</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {footerNav.slice(7).map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-cream/80 hover:text-accent">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-cream text-sm font-bold uppercase tracking-wider">Get in touch</h3>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li>📧 <a href={`mailto:${site.email}`} className="hover:text-accent">{site.email}</a></li>
            <li>📱 <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-accent">{site.phone}</a></li>
            <li>📍 {site.location}</li>
          </ul>
          <Link href="/design-your-own" className="btn btn-primary mt-5 text-sm">Design your own</Link>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-cream/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {site.name}. Handcrafted in Wakefield. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/shop" className="hover:text-accent">Shop</Link>
            <Link href="/blog" className="hover:text-accent">Blog</Link>
            <Link href="/faqs" className="hover:text-accent">FAQs</Link>
            <Link href="/contact-us" className="hover:text-accent">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold hover:bg-primary transition"
    >
      {children}
    </a>
  );
}
