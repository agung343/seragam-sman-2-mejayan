"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "../prisma";
import { getSession } from "../session";

type State = {
  success: boolean;
  errorMsg: string | null;
};

const Schema = z.object({
  studentId: z.string().min(1),
  productId: z.string().min(1),
  paid: z.coerce.number().min(0),
});

const cicilanSchema = z.object({
  paid: z.coerce.number().min(1)
})

function generateInvoice(student: string) {
  return `MONITA-${student}`;
}

export async function SaleAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  const session = await getSession();
  if (!session || session.role !== "OWNER") {
    return {
      success: false,
      errorMsg: "Unauthorized",
    };
  }

  const parsed = Schema.safeParse({
    studentId: formData.get("student"),
    productId: formData.get("product"),
    paid: formData.get("paid"),
  });
  if (!parsed.success) {
    return {
      success: false,
      errorMsg: "Form Siswa, Paket dan Bayar dilengkapi.",
    };
  }
  const { studentId, productId, paid } = parsed.data;
  const product = await prisma.product.findFirst({
    where: { id: productId },
  });
  if (!product)
    return {
      success: false,
      errorMsg: "Paket tidak ditemukan.",
    };
  if (product.stock < 1)
    return {
      success: false,
      errorMsg: "Paket sudah habis.",
    };

  const student = await prisma.user.findFirst({
    where: {
      id: studentId,
    },
  });

  const status =
    paid === 0 ? "BELUM_DIBAYAR" : paid >= product.price ? "LUNAS" : "CICILAN";

  const existedSale = await prisma.sale.findFirst({
    where: {
      userId: studentId
    }
  })
  if (existedSale) {
    return {
      success: false,
      errorMsg: "Siswa telah mengambil paket"
    }
  }

  if (paid > product.price) {
    return {
      success: false,
      errorMsg: "Input pembayaran tidak sesuai harga"
    }
  }

  await prisma.$transaction([
    prisma.sale.create({
      data: {
        invoice: generateInvoice(student!.name),
        userId: studentId,
        productId,
        paid,
        status,
      },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { stock: { decrement: 1 } },
    }),
  ]);

  revalidatePath("/");
  return {
    success: true,
    errorMsg: null
  };
}


export async function updateCicilan(studentId: string, prevState: State, formData: FormData) {
  const session = await getSession();
  if (!session || session.role === "STUDENT") {
    return {
      success: false,
      errorMsg: "Unauthorized"
    }   
  }
  
  const parsed = cicilanSchema.safeParse({
    paid: formData.get("paid")
  })
  if (!parsed.success) {
    return {
      success: false,
      errorMsg: "Input pembayaran salah"
    }
  }
  const {paid} = parsed.data

  const existingSale = await prisma.sale.findFirst({
    where: {
      userId: studentId
    },
    include: {
      product: {
        select: {
          price: true
        }
      }
    }
  })
  if (!existingSale) {
    return {
      success: false,
      errorMsg: "Siswa belum mengambil seragam"
    }
  }

  const remaining = existingSale.product.price - existingSale.paid
  const lunas = remaining === paid
  if (paid > remaining) {
    return {
      success: false,
      errorMsg: "Mohon masukan yg sesuai"
    }
  }

  const totalPaid = existingSale.paid + paid

  await prisma.sale.update({
    where: {id: existingSale.id},
    data: {
      paid: totalPaid,
      status: lunas ? "LUNAS" : "CICILAN"
    } 
  })

  revalidatePath("/")
  redirect("/daftar")
}