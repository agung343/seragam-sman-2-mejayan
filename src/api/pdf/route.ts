import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
    const session = await getSession()
    if (!session) {
        return new NextResponse("Unauthorized", {status: 401})
    }

    const { username, role } = session

    const student = await prisma.user.findFirst({
        where: {username, role},
        include: {
            sale: {
                include: {
                    product: true
                }
            }
        }
    })
    console.log("Data student: ", student)

    if (!student || student.sale.length === 0) {
        return new NextResponse("Student not found", {status: 404})
    }

    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([400,600])

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const { height} = page.getSize()
    const drawText = (text: string, y:number) => {
        page.drawText(text, {
            x: 50,
            y,
            size: 12,
            font,
            color: rgb(0,0,0)
        })
    }
    drawText("Nota Pembelian Seragam", height - 50)
    drawText(`No Nota: ${student.sale[0]?.invoice}`, height -75)
    drawText(`Nama: ${student.name}`, height -100)
    drawText(`Kelas: ${student.class}`, height -120)
    drawText(`${student.sale[0]?.product.name}`, height -140)
    drawText(`Bayar: ${student.sale[0]?.paid.toString()}`, height -200)
    drawText(`Status: ${student.sale[0]?.status}`, height - 250)

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(Buffer.from(pdfBytes), {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=nota.pdf"
        }
    })
}