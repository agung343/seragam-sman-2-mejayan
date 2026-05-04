import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const EXPIRES = "3d";

async function getSecretKey() {
  const secret = process.env.JWT_SECRET!;
  const encoded = new TextEncoder().encode(secret);
  return await crypto.subtle.importKey(
    "raw",
    encoded,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createToken(payload: {
  id: string;
  name: string;
  username: string;
  role: string;
}) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(EXPIRES)
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as {
      id: string;
      name: string;
      username: string;
      role: "OWNER" | "TEACHER" | "STUDENT";
    };
  } catch (error) {
    return null;
  }
}
