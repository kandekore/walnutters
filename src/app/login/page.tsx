import { Suspense } from "react";
import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="container-x flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="eyebrow">Welcome back</span>
          <h1 className="mt-2 text-3xl font-extrabold text-heading">Sign in to Walnutterz</h1>
          <p className="mt-2 text-sm text-ink/70">
            Demo customer: <strong>customer@example.com</strong> / <strong>password123</strong>
          </p>
        </div>
        <Suspense fallback={<div className="card p-8 text-center text-ink/60">Loading…</div>}>
          <AuthForm mode="login" />
        </Suspense>
      </div>
    </div>
  );
}
