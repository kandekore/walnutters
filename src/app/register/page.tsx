import { Suspense } from "react";
import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Create an account",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="container-x flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="eyebrow">Join the community</span>
          <h1 className="mt-2 text-3xl font-extrabold text-heading">Create your account</h1>
          <p className="mt-2 text-sm text-ink/70">Track your orders and save your payment methods.</p>
        </div>
        <Suspense fallback={<div className="card p-8 text-center text-ink/60">Loading…</div>}>
          <AuthForm mode="register" />
        </Suspense>
      </div>
    </div>
  );
}
