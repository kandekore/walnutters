"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function DashboardNav({
  links,
  title,
}: {
  links: { href: string; label: string }[];
  title: string;
}) {
  const pathname = usePathname();
  return (
    <aside className="lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:self-start">
      <div className="card p-4">
        <p className="px-2 pb-2 text-sm font-bold uppercase tracking-wide text-secondary">{title}</p>
        <nav className="space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname === l.href ? "bg-primary text-white" : "text-ink hover:bg-cream"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-2 block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-secondary hover:bg-cream"
          >
            Sign out
          </button>
        </nav>
      </div>
    </aside>
  );
}
