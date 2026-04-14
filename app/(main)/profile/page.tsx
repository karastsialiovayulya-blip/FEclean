"use client";

import { redirect } from "next/navigation";
import { userStore } from "@/lib/store/userStore";
import { Customer } from "@/lib/types/types";
import {
  Location03Icon,
  MailEdit01Icon,
  Plant03Icon,
  TelephoneIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import CustomerPage from "@/components/profilePages/customerPage";
import { Button } from "@/components/ui/button";
import ContactInformation from "@/components/users/contactInformation";

export default function Profile() {
  const { user } = userStore();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="px-[10%] py-10">
      <div className="flex items-end justify-between">
        <div className="">
          <span className="text-primary font-label mb-4 block text-sm tracking-widest uppercase">
            Personal Sanctuary
          </span>
          <h1 className="mb-6 text-5xl leading-none font-bold md:text-6xl">
            Welcome back,
            <span className="text-primary">
              {user.firstName} {user.lastName}
            </span>
          </h1>
          <p className="text-lg">
            Manage your botanical cleanings and profile settings. Your home's harmony is our highest
            priority.
          </p>
        </div>
        <div className="mt-8 md:mt-0">
          <div className="border-outline-variant/20 flex items-center gap-6 rounded-xl border bg-white p-8 shadow-sm">
            <div className="bg-secondary text-primary flex h-16 w-16 items-center justify-center rounded-xl">
              <HugeiconsIcon icon={Plant03Icon} />
            </div>
            <div>
              <div className="text-sm font-medium">Member Since</div>
              <div className="text-xl font-bold">March 2023</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 flex gap-10">
        <ContactInformation user={user} />
        {user.roles.includes("ROLE_USER") && <CustomerPage user={user as Customer} />}
      </div>
    </div>
  );
}
