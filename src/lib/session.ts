import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** Return the current session user, or null. */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/** Require any authenticated user; redirect to login otherwise. */
export async function requireUser(callbackUrl = "/account") {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  return user;
}

/** Require an admin; redirect non-admins away. */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/admin")}`);
  }
  if (user.role !== "ADMIN") {
    redirect("/account");
  }
  return user;
}
