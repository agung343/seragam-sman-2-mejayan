"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/action/auth";

type Session = {
  id: string;
  username: string;
  role: "OWNER" | "TEACHER" | "STUDENT";
} | null;

export default function DesktopNavigation({ session }: { session: Session }) {
  const pathname = usePathname();

  if (!session) {
    return (
      <nav className="hidden md:flex items-center justify-around h-12 p-4 bg-[#490FCB]">
        <h1 className="text-4xl font-bold dark:text-black text-neutral-100">
          Toko Monita 
        </h1>
      </nav>
    );
  }

  const role = session.role;

  return (
    <nav className="hidden md:flex items-center gap-4 h-16 p-4 bg-[#490FCB]">
      <h1 className="text-2xl font-bold text-neutral-100 ">
        Seragam SMAN2 Mejayan
      </h1>
      {role === "OWNER" && (
        <>
          <NavLink href="/" label="Penjualan" active={pathname === "/"} />
          <NavLink
            href="/daftar"
            label="Daftar"
            active={pathname.includes("/daftar")}
          />
        </>
      )}

      {role === "TEACHER" && (
        <>
          <NavLink
            href="/daftar"
            label="Daftar"
            active={pathname.includes("/daftar")}
          />
        </>
      )}
      {role === "STUDENT" && (
        <NavLink
          href="/status"
          label="Status"
          active={pathname.includes("/status")}
        />
      )}
      <LogoutButton />
    </nav>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 ${
        active ? "text-neutral-100 font-semibold" : "text-gray-300"
      }`}
    >
      <span className="text-lg font-medium">{label}</span>
    </Link>
  );
}

function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="p-2 rounded-md bg-red-500 text-neutral-100"
      >
        Logout
      </button>
    </form>
  );
}
