"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logout01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const pathname = usePathname();

  const links = [
    { href: "/", title: "Home" },
    { href: "/services", title: "Services" },
    { href: "/about", title: "About" },
    { href: "/contact-us", title: "Contact us" },
  ];

  const accLinks = [
    { href: "/profile", title: "Profile" },
    { href: "/profile/settings", title: "Settings" },
  ];

  return (
    <header className="relative flex w-full items-center justify-between bg-white px-[10%] py-5">
      <h3 className="text-secondary-foreground text-lg font-bold">Lumina Clean</h3>
      <div className="absolute right-0 left-0 flex justify-center">
        <nav className="text-secondary-foreground flex gap-12">
          {links.map((link, index) => (
            <Link
              href={link.href}
              key={index}
              className={cn(
                pathname === link.href && "font-bold underline underline-offset-3 transition-all",
              )}
            >
              {link.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="z-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <HugeiconsIcon icon={UserIcon} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-sm">My Account</DropdownMenuLabel>
              {accLinks.map((link, index) => (
                <DropdownMenuItem key={index}>
                  <Link
                    href={link.href}
                    className="text-sm"
                  >
                    {link.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  window.location.href = "/dashboard";
                }}
                className="text-sm"
              >
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button className="flex items-center gap-1 text-sm text-red-500">
                  Log out <HugeiconsIcon icon={Logout01Icon} />
                </button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
