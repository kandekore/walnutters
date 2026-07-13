import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import PaymentMethods from "@/components/PaymentMethods";

export default async function PaymentMethodsPage() {
  const user = await requireUser("/account/payment-methods");
  const methods = await prisma.paymentMethod.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <PaymentMethods
      methods={methods.map((m) => ({
        id: m.id,
        brand: m.brand,
        last4: m.last4,
        expMonth: m.expMonth,
        expYear: m.expYear,
        isDefault: m.isDefault,
      }))}
    />
  );
}
