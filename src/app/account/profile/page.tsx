import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const sessionUser = await requireUser("/account/profile");
  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-heading">Profile</h2>
      <p className="mt-2 text-sm text-ink/70">Update your name or change your password.</p>
      <div className="mt-6 max-w-lg">
        <ProfileForm name={user?.name ?? ""} email={user?.email ?? ""} />
      </div>
    </div>
  );
}
