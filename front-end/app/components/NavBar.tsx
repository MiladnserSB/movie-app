"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavBar = () => {
  const pathname = usePathname();

  const links = [
    { href: "/movies", label: "Movies" },
    { href: "/actors", label: "Actors" },
    { href: "/admin/movies", label: "Manage Movies" },
    { href: "/admin/actors", label: "Manage Actors" },
  ];

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 bg-gray-900 text-white shadow-md">
      {/* الشعار */}
      <Link
        href="/movies"
        className="text-xl font-bold text-yellow-400 tracking-wide"
      >
        🎬 MovieApp
      </Link>

      {/* روابط الصفحات الأربع */}
      <ul className="flex items-center gap-2 list-none m-0 p-0">
        {links.map(({ href, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");

          return (
            <li key={href}>
              <Link
                href={href}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-yellow-400 text-gray-900 font-semibold"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavBar;
