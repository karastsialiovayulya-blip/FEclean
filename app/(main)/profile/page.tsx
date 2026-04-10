"use client";

import { redirect } from "next/navigation";
import { userStore } from "@/lib/store/userStore";
import {
  Location03Icon,
  MailEdit01Icon,
  Plant03Icon,
  TelephoneIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const { user } = userStore();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="px-[15%] py-10">
      <div className="flex items-end justify-between">
        <div className="">
          <span className="text-primary font-label mb-4 block text-sm tracking-widest uppercase">
            Personal Sanctuary
          </span>
          <h1 className="mb-6 text-5xl leading-none font-bold md:text-6xl">
            Welcome back,
            <br />
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
      <div className="mt-15">
        <aside className="w-fit min-w-max">
          <section className="flex flex-col gap-5 rounded-xl bg-white p-8 transition-all duration-300 hover:translate-y-[-2px]">
            <h2 className="text-xl font-bold">Contact Information</h2>
            <div className="space-y-6 pe-10">
              <div className="flex items-center gap-4">
                <HugeiconsIcon
                  className="text-primary/60"
                  icon={MailEdit01Icon}
                />
                <div>
                  <p className="text-xs font-semibold tracking-wider uppercase">Email Address</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <HugeiconsIcon
                  className="text-primary/60"
                  icon={TelephoneIcon}
                />
                <div>
                  <p className="text-xs font-semibold tracking-wider uppercase">Phone Number</p>
                  <p className="font-medium">+1 (555) 234-8890</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <HugeiconsIcon
                  className="text-primary/60"
                  icon={Location03Icon}
                />
                <div>
                  <p className="text-xs font-semibold tracking-wider uppercase">
                    Primary Residence
                  </p>
                  <p className="font-medium">
                    122 High Street, Suite 4B
                    <br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
            </div>
            <Button
              size="normal"
              variant="secondary"
            >
              Edit Profile
            </Button>
          </section>
        </aside>
      </div>
    </div>
  );
}
