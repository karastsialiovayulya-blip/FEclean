"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/api/actions/auth";
import { userStore } from "@/lib/store/userStore";
import { cn } from "@/lib/utils";
import { Cancel01Icon, Logout01Icon, Menu01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import CartPopup from "@/components/popups/cartPopup";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = userStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const logOut = async () => {
    await logoutAction();
    logout();
  };

  const links = [
    { href: "/", title: "Home" },
    { href: "/services", title: "Services" },
    { href: "/about", title: "About" },
    { href: "/contact-us", title: "Contact us" },
  ];

  const accLinks = [{ href: "/profile", title: "Profile" }];

  return (
    <header className="relative z-20 w-full bg-white px-5 py-5 lg:px-[10%]">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">
          <span className="text-primary">Lumina</span>
          <span className="uppercase">Clean</span>
        </h3>

        <div className="absolute right-0 left-0 hidden justify-center lg:flex">
          <nav className="text-primary flex gap-12">
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

        <div className="z-2 hidden items-center gap-5 lg:flex">
          <CartPopup />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="cursor-pointer"
                >
                  <HugeiconsIcon icon={UserIcon} />
                </button>
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
                  {user?.roles.includes("ROLE_ADMIN") && (
                    <DropdownMenuItem
                      onClick={() => {
                        window.location.href = "/dashboard";
                      }}
                      className="text-sm"
                    >
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <button
                      className="flex items-center gap-1 text-sm text-red-500"
                      onClick={logOut}
                    >
                      Log out <HugeiconsIcon icon={Logout01Icon} />
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/sign-in">Sign In</Link>
              <Link href="/sign-up">
                <Button className="px-3 py-4 text-base">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          className="lg:hidden"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <HugeiconsIcon icon={isMobileMenuOpen ? Cancel01Icon : Menu01Icon} />
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-border mt-4 rounded-3xl border bg-white p-5 shadow-lg lg:hidden">
          <nav className="text-primary flex flex-col gap-4">
            {links.map((link, index) => (
              <Link
                href={link.href}
                key={index}
                className={cn(
                  "rounded-lg px-2 py-1 text-lg transition-all",
                  pathname === link.href && "bg-secondary font-bold",
                )}
              >
                {link.title}
              </Link>
            ))}
          </nav>

          <div className="my-5 border-t" />

          <div className="flex flex-col gap-4">
            <div className="w-fit">
              <CartPopup />
            </div>

            {user ? (
              <div className="flex flex-col gap-3">
                {accLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="rounded-2xl px-2 py-1 text-lg"
                  >
                    {link.title}
                  </Link>
                ))}
                {user?.roles.includes("ROLE_ADMIN") && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      window.location.href = "/dashboard";
                    }}
                    className="w-fit rounded-2xl px-2 py-1 text-left text-lg"
                  >
                    Dashboard
                  </button>
                )}
                <button
                  type="button"
                  className="flex w-fit items-center gap-1 rounded-2xl px-2 py-1 text-lg text-red-500"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logOut();
                  }}
                >
                  Log out <HugeiconsIcon icon={Logout01Icon} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    className="w-full"
                    size="normal"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    className="w-full"
                    size="normal"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
