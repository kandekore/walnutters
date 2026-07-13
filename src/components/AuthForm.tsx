"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/account";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));

    try {
      if (mode === "register") {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: fd.get("name"), email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration failed");
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) throw new Error("Invalid email or password");
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6 md:p-8">
      {mode === "register" && (
        <div>
          <label className="mb-1 block text-sm font-semibold text-heading" htmlFor="name">Name</label>
          <input id="name" name="name" required className="w-full rounded-xl border border-trim px-4 py-3 outline-none focus:border-primary" />
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm font-semibold text-heading" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required className="w-full rounded-xl border border-trim px-4 py-3 outline-none focus:border-primary" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-heading" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required minLength={6} className="w-full rounded-xl border border-trim px-4 py-3 outline-none focus:border-primary" />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
      </button>

      <p className="text-center text-sm text-ink/70">
        {mode === "login" ? (
          <>New to Walnutterz? <Link href="/register" className="font-semibold text-secondary hover:underline">Create an account</Link></>
        ) : (
          <>Already have an account? <Link href="/login" className="font-semibold text-secondary hover:underline">Sign in</Link></>
        )}
      </p>
    </form>
  );
}
