import Link from "next/link";
import prisma from "@/lib/prisma";
import ClassFilter from "@/components/dashboard/class-filter";
import { Pen } from "lucide-react";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ class?: string }>;
}) {
  const { class: selectedClass } = await searchParams;
  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      ...(selectedClass ? { class: selectedClass } : {}),
    },
    include: {
      sale: {
        select: {
          paid: true,
          status: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
    take: 40
  });

  const report = students.map((student) => {
    const sale = student.sale[0] ?? null;
    if (!sale) {
      return {
        id: student.id,
        name: student.name,
        paid: 0,
        status: "BELUM DIBAYAR" as const,
      };
    }
    return {
      id: student.id,
      name: student.name,
      paid: sale.paid,
      status: sale.status,
    };
  });

  return (
    <main className="p-2.5 space-y-4 mt-3 md:min-h-[89vh] pb-24 md:pb-0">
      <h1 className="text-2xl md:text-4xl font-semibold dark:text-neutral-100 text-sky-600 text-center">
        Daftar Siswa {selectedClass}
      </h1>
      <ClassFilter selected={selectedClass ?? ""} />
      <div className="overflow-auto p-1.5 md:p-4">
        <table className="p-1.5 w-full text-sm md:text-lg mx-auto border sticky">
          <thead>
            <tr>
              <th className="font-bold p-1.5 border dark:text-neutral-100 text-left">
                Nama
              </th>
              <th className="font-bold p-1.5 border dark:text-neutral-100 text-center md:w-32">
                Bayar
              </th>
              <th className="font-bold p-1.5 border dark:text-neutral-100 text-center">
                Status
              </th>
              <th className="p-1.5 border" />
            </tr>
          </thead>
          <tbody>
            {report.map((row) => (
              <tr key={row.id} className="odd:bg-sky-200 even:bg-sky-100">
                <td className="p-1 font-light text-[10px] md:text-base border dark:text-neutral-800 text-left">
                  {row.name}
                </td>
                <td className="p-1 font-light text-[10px] md:text-base border dark:text-neutral-800 text-right">
                  {row.paid}
                </td>
                <td className="p-1 font-light text-[10px] md:text-base border dark:text-neutral-800 text-center">
                  {row.status}
                </td>
                <td className="p-1 border text-center">
                  <div className="flex justify-center">
                    <Link
                      href={`/daftar/${row.id}`}
                      className={`${
                        row.status !== "LUNAS"
                          ? "text-green-500"
                          : "text-gray-500"
                      } `}
                    >
                      <Pen size={14} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
