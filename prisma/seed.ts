import prisma from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"

async function main() {
  await prisma.user.deleteMany()
  await prisma.product.deleteMany()
  await prisma.sale.deleteMany()

  console.log("Seeding product")
  const products = [
    { name: "Paket Seragam Pria Standart", price: 1510000, stock: 200 },
    { name: "Paket Seragam Perempuan Standart", price: 1510000, stock: 150 },
    { name: "Paket Seragam Perempuan Hijab", price: 1630000, stock: 200 },
    { name: "Paket Seragam Pria Jumbo", price: 1740000, stock: 50 },
    { name: "Paket Seragam Perempuan Jumbo", price: 1740000, stock: 50 },
    { name: "Paket Seragam Perempuan Hijab Jumbo", price: 1830000, stock: 50 },
  ]
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name },
      create: product,
      update: {}
    })
  }

  await prisma.user.create({
    data: {
      username: "agung",
      name: "Agung Pemilik",
      password: await hashPassword("agfg90"),
      role: "OWNER",
    },
  })

  for (const t of [
    { username: "guru_salma", name: "Ibu Salma" },
    { username: "guru_budi", name: "Bapak Budi" },
  ]) {
    await prisma.user.create({
      data: {
        username: t.username,
        name: t.name,
        password: await hashPassword("guru2026"),
        role: "TEACHER",
      },
    })
  }

  console.log("seeding student...")
  const classes = Array.from({ length: 10 }, (_, i) => `X-${i + 1}`);
  const studentsPerClass = 36 
  for (const className of classes) {
    for (let i = 1; i <= studentsPerClass; i++) {
      const studentNumber = i.toString().padStart(2, '0');
      const username = `${className.replace('-', '')}${studentNumber}`; // Contoh: X101, X102...
      
      await prisma.user.upsert({
        where: { username: username },
        update: {},
        create: {
          username: username,
          name: `Siswa ${className} No ${studentNumber}`,
          password: await hashPassword("password123"), // Sangat disarankan untuk di-hash nantinya
          role: "STUDENT",
          class: className,
        },
      });
    }
  }


  console.log("🏁 Seeding selesai!")
}

main().finally(() => prisma.$disconnect())