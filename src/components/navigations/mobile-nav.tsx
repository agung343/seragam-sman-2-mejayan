"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, User, LogIn, LogOut } from "lucide-react";
import { logoutAction } from "@/lib/action/auth";

type Session = {
  id: string;
  username: string;
  role: "OWNER" | "TEACHER" | "STUDENT";
} | null;

export default function MobileNavigation({ session }: { session: Session }) {
  const pathname = usePathname();

  if (!session) {
    return (
      <nav className="fixed bottom-0 w-full bg-neutral-100 border-t flex justify-around p-4 md:hidden">
        <Link href={"/login"} className="flex flex-col gap-1.5">
          <LogIn size={24} className="dark:text-black" />
          <span className="text-xs dark:text-black">Login</span>
        </Link>
      </nav>
    );
  }

  const role = session.role;

  return (
    <nav className="fixed bottom-0 w-full bg-neutral-100 border-t flex justify-around p-4 md:hidden">
      {role === "OWNER" && (
        <>
          <NavLink
            href="/"
            icon={<Home size={24} />}
            label="Penjualan"
            active={pathname === "/"}
          />
          <NavLink
            href="/daftar"
            icon={<LayoutDashboard size={24} />}
            label="Daftar"
            active={pathname.includes("/daftar")}
          />
        </>
      )}

      {role === "TEACHER" && (
        <>
          <NavLink
            href="/daftar"
            icon={<LayoutDashboard size={24} />}
            label="Daftar"
            active={pathname.includes("/daftar")}
          />
        </>
      )}
      {role === "STUDENT" && (
        <NavLink
          href="/status"
          icon={<User size={24} />}
          label="Status"
          active={pathname === "/status"}
        />
      )}
      <LogoutButton />
    </nav>
  );
}

function NavLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: any;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 ${
        active ? "text-blue-500" : "text-gray-500"
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}

function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button className="flex flex-col items-center gap-1 text-gray-500">
        <LogOut size={24} />
        <span className="text-[10px] font-medium">Logout</span>
      </button>
    </form>
  );
}
