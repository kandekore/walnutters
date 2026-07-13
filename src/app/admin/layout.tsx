import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import DashboardNav from "@/components/DashboardNav";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/custom-requests", label: "Design requests" },
  { href: "/admin/gallery", label: "Gallery moderation" },
  { href: "/admin/content", label: "Site content" },
  { href: "/admin/messages", label: "Messages" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="container-x py-10 md:py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="eyebrow">Admin</span>
          <h1 className="mt-2 text-3xl font-extrabold text-heading">Walnutterz control room</h1>
          <p className="text-sm text-ink/60">Signed in as {user.email}</p>
        </div>
        <Link href="/" className="btn btn-ghost text-sm">View site →</Link>
      </div>
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <DashboardNav title="Manage" links={LINKS} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
