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
  console.log(student);

  const sale = student.sale[0]

  return (
    <main className="p-2.5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-light text-xl">
            Nama: <span className="font-semibold">{student.name}</span>
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
        <div className="flex justify-center">
          <a href="/api/pdf" download="nota.pdf">
            <button className="bg-blue-500/70 active:bg-blue-500 px-2 py-4 rounded-md">
              Download PDF Nota
            </button>
          </a>
        </div>
      </div>
    </main>
  );
}
