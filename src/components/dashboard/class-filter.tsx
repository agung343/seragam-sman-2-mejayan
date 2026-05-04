"use client";
import { useRouter } from "next/navigation";
import { CLASS } from "../forms/sale-form";

export default function ClassFilter({ selected }: { selected: string }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm dark:text-neutral-100">Kelas:</label>
      <select
        value={selected}
        className="p-2.5 rounded-md border border-gray-500 dark:text-gray-600"
        onChange={(e) =>
          router.push(e.target.value ? `?class=${e.target.value}` : "?")
        }
      >
        <option value={""}>Pilih Kelas...</option>
        {CLASS.map((c) => (
          <option value={c} key={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
