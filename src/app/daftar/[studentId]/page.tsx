import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import CicilanForm from "@/components/forms/cicilan-form"

export default async function UpdateStudentPage({params} : {params: Promise<{studentId: string}>}) {
    const studentId = (await params).studentId

    const student = await prisma.user.findFirst({
        where: {
            id: studentId,
            role: "STUDENT"
        },
        select: {
            id: true,
            name: true
        }
    })

    if (!student) {
        return notFound()
    }

    const sale = await prisma.sale.findFirst({
        where: { userId: student.id},
        include: {
            product: {
                select: {
                    name: true,
                    price: true
                }
            }
        }
    })
    if (!sale) {
        return (
            <main className="p-2.5 md:p-4">
                <h1 className="text-xl md:text-2xl font-semibold">
                    {student.name} <span className="font-light">belum mengambil seragam</span>
                </h1>
            </main>
        )
    }

    const amountToPay = sale.product.price - sale.paid

    console.log("name", student)

    return (
        <main className="p-2.5 md:p-4 space-y-2.5 md:spce-y-4">
            <h1 className="text-2xl md:text-4xl font-semibold text-neutral-800/70 text-center">
                Pembayaran Cicilan
            </h1>
            <div className="flex flex-col gap-2 md:gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <label className="text-sm md:text-base">Nama</label>
                    <input className="px-1.5 md:px-2 py-2.5 md:py-4 font-semibold" readOnly defaultValue={student.name} />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <label className="text-sm md:text-base">Kekurangan</label>
                    <input className="px-1.5 md:px-2 py-2.5 md:py-2 font-semibold" defaultValue={`Rp. ${amountToPay}`} />
                </div>
                <CicilanForm studentId={studentId} />
            </div>
        </main>
    )
}