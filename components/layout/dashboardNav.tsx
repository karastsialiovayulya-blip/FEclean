"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Analytics03Icon,
  ArrowTurnBackwardIcon,
  CleanIcon,
  CleaningBucketIcon,
  DashboardSquare02Icon,
  Image02Icon,
  UserGroupIcon,
  VacuumCleanerIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "../ui/button";

export default function DashboardNav() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", title: "Dashboard", icon: DashboardSquare02Icon },
    { href: "/dashboard/services", title: "Services", icon: CleanIcon },
    { href: "/dashboard/inventory", title: "Invenory", icon: CleaningBucketIcon },
    { href: "/dashboard/orders", title: "Orders", icon: VacuumCleanerIcon },
    { href: "/dashboard/users", title: "Users", icon: UserGroupIcon },
    { href: "/dashboard/media", title: "Media", icon: Image02Icon },
    { href: "/dashboard/analytics", title: "Analytics", icon: Analytics03Icon },
  ];

  return (
    <div className="fixed flex h-screen w-[20%] flex-col justify-between border-r-3 px-7 py-8">
      <div className="flex flex-col gap-15">
        <div>
          <h2 className="text-secondary-foreground text-xl font-bold">Admin Portal</h2>
          <p className="uppercase">Managment suite</p>
        </div>
        <ul className="flex flex-col gap-2">
          {links.map((link, index) => (
            <li
              key={index}
              className={cn(
                "hover:bg-primary/20 rounded-lg px-2 py-3 transition-all hover:scale-105",
                pathname === link.href && "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              <Link
                href={link.href}
                className="items center flex gap-3"
              >
                <HugeiconsIcon icon={link.icon} />
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Button
        size="normal"
        className="flex items-center gap-2"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        Back to Lumina
        <HugeiconsIcon icon={ArrowTurnBackwardIcon} />
      </Button>
    </div>
  );
}
