import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function Status() {
  const session = await getSession();

  if (!session) {
    return null;
  }
  const { username, role } = session;
  const student = await prisma.user.findFirst({
    where: {
      username,
      role,
    },
    include: {
      sale: {
        select: {
          paid: true,
          status: true,
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!student) return null;

  const sale = student.sale[0]

  return (
    <main className="p-2.5 md:p-4 min-h-screen">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-light text-xl">
            Nama: <span className="font-semibold">{student.name}</span>
          </p>
          <p className="font-light text-xl">
            Sekolah: <span className="font-semibold">SMA Negeri 2 Mejayan</span>
          </p>
          <p className="font-light text-xl">
            Kelas: <span className="font-semibold">{student.class}</span>
          </p>
          {student.sale.length > 0 ? (
            <>
              <p className="font-light text-xl">
                Paket:{" "}
                <span className="font-semibold">
                  {sale.product.name}
                </span>
              </p>
              <p className="font-light text-xl">
                Bayar:{" "}
                <span className="font-semibold">
                  Rp. {sale.paid}
                </span>
              </p>
              <p className="font-light text-xl">
                Status:{" "}
                <span className="font-semibold">
                  {sale.status}
                </span>
              </p>
            </>
          ) : (
            <>
              <p className="font-light text-xl">
                Paket:{" "}
                <span className="font-semibold">
                  Belum Mengambil Seragam
                </span>
              </p>
              <p className="font-light text-xl">
                Bayar:{" "}
                <span className="font-semibold">
                  Rp. 0
                </span>
              </p>
              <p className="font-light text-xl">
                Status:{" "}
                <span className="font-semibold">
                  Belum Dibayar
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
