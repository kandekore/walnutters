"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { mainNav, site } from "@/lib/site";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 border-b border-trim bg-white/95 backdrop-blur">
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Walnutterz home">
          <Image
            src={site.logo}
            alt="Walnutterz"
            width={92}
            height={61}
            priority
            className="h-auto w-[84px] md:w-[92px]"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {mainNav.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenGroup(item.label)}
                onMouseLeave={() => setOpenGroup(null)}
              >
                <button
                  className="px-3 py-2 text-sm font-semibold text-heading hover:text-primary transition"
                  aria-expanded={openGroup === item.label}
                >
                  {item.label} <span className="text-primary">▾</span>
                </button>
                {openGroup === item.label && (
                  <div className="absolute left-0 top-full w-64 rounded-xl border border-trim bg-white p-2 shadow-card">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-cream hover:text-secondary transition"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                className={`px-3 py-2 text-sm font-semibold transition hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-heading"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          <Link
            href={isAdmin ? "/admin" : session ? "/account" : "/login"}
            className="hidden sm:inline-flex btn btn-ghost text-sm"
          >
            {isAdmin ? "Admin" : session ? "My Account" : "Sign in"}
          </Link>

          <button
            onClick={() => setOpen(true)}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream transition"
            aria-label={`Open cart (${count} items)`}
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </button>

          <Link href="/contact-us" className="hidden md:inline-flex btn btn-primary text-sm">
            Get in touch
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-trim bg-white">
          <nav className="container-x py-4 max-h-[calc(100vh-var(--header-h))] overflow-y-auto" aria-label="Mobile">
            {mainNav.map((item) =>
              item.children ? (
                <details key={item.label} className="border-b border-cream-deep py-1">
                  <summary className="cursor-pointer list-none py-2 font-semibold text-heading flex items-center justify-between">
                    {item.label}
                    <span className="text-primary">＋</span>
                  </summary>
                  <div className="pb-2 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-2 text-sm text-ink hover:text-primary"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-cream-deep py-3 font-semibold text-heading hover:text-primary"
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={isAdmin ? "/admin" : session ? "/account" : "/login"}
                onClick={() => setMobileOpen(false)}
                className="btn btn-outline"
              >
                {isAdmin ? "Admin dashboard" : session ? "My Account" : "Sign in / Register"}
              </Link>
              <Link href="/contact-us" onClick={() => setMobileOpen(false)} className="btn btn-primary">
                Get in touch
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-heading">
      <circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" />
      <path d="M2 3h3l2.4 12.3a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.8L21 7H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-heading">
      <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-heading">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
