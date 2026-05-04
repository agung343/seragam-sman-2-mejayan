import prisma from "@/lib/prisma";
import SaleForm from "@/components/forms/sale-form";
import LastestSale from "@/components/latest-sale";

export default async function Home() {
  const [students, products, salesResult] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: "STUDENT",
      },
      select: {
        id: true,
        name: true,
        class: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
      },
    }),
    prisma.sale.findMany({
      include: {
        user: true,
        product: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10
    })
  ]);

  const sales = salesResult.map(sale => ({
    id: sale.id,
    name: sale.user.name,
    product: sale.product.name,
    paid: sale.paid,
    status: sale.status.replace("_", " ") as "BELUM DIBAYAR" | "CICILAN" | "LUNAS"
  }))

  return (
    <main className="p-2.5 md:p-4">
      <SaleForm students={students} products={products} />
      <LastestSale sales={sales} />
    </main>
  );
}
