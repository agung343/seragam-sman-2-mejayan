"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "../prisma";
import { verifyPassword, createToken } from "../auth";
import { revalidatePath } from "next/cache";

const Schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
})

type State = {
  success: boolean
  errorMsg?: string
}

export async function loginAction(prevState: State, formData:FormData): Promise<State> {
  const parsed = Schema.safeParse({
    username: formData.get("username"),
    password: formData.get("password")
  })
  if (!parsed.success) {
    return {
      success: false,
      errorMsg: "username dan password harus di-isi."
    }
  }

  const {username, password} = parsed.data

  const user = await prisma.user.findUnique({
    where: {
      username
    }
  })
  if (!user || !(await verifyPassword(password, user.password))) {
    return {
      success: false,
      errorMsg: "username atau password salah."
    }
  }

  const token = await createToken({
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role
  })

  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 3,
    path: "/"
  })

  redirect("/")
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  revalidatePath("/", "layout")
  redirect("/login")
}