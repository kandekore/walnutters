import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import DashboardNav from "@/components/DashboardNav";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

const LINKS = [
  { href: "/account", label: "Order history" },
  { href: "/account/payment-methods", label: "Payment methods" },
  { href: "/account/profile", label: "Profile" },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/account");

  return (
    <div className="container-x py-10 md:py-16">
      <div className="mb-8">
        <span className="eyebrow">My Account</span>
        <h1 className="mt-2 text-3xl font-extrabold text-heading">
          Hi {user.name?.split(" ")[0] ?? "there"} 👋
        </h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <DashboardNav title="Dashboard" links={LINKS} />
        <div>{children}</div>
      </div>
    </div>
  );
}
