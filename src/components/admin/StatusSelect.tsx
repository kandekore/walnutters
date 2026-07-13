"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StatusSelect({
  url,
  field,
  value,
  options,
}: {
  url: string;
  field: string;
  value: string;
  options: string[];
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(value);
  const [saving, setSaving] = useState(false);

  async function change(next: string) {
    setSaving(true);
    setCurrent(next);
    await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: next }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <select
      value={current}
      disabled={saving}
      onChange={(e) => change(e.target.value)}
      className="rounded-lg border border-trim bg-white px-3 py-1.5 text-sm font-semibold text-secondary outline-none focus:border-primary"
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}
