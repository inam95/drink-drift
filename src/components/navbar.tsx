import Image from "next/image";
import Link from "next/link";

import { navLinks } from "@/constants/nav-links";

export function Navbar() {
  return (
    <nav className="fixed z-50 w-full bg-slate-50/10 shadow-sm">
      <div className="container mx-auto flex flex-col items-center gap-5 px-5 py-5 md:flex-row md:justify-between lg:px-0">
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-2 text-sm text-nowrap md:text-base"
        >
          <Image src="/images/logo.png" alt="logo" width={32} height={32} />
          <p className="font-modern-negra -mb-2 text-3xl">Drink Drift</p>
        </Link>
        <ul className="flex-center flex gap-7 lg:gap-12">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="hover:text-yellow-text cursor-pointer font-sans text-sm font-semibold text-nowrap md:text-base"
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
