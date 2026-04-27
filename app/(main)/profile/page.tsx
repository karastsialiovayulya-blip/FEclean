"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userStore } from "@/lib/store/userStore";
import { Cleaner, Customer } from "@/lib/types/types";
import { Plant03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import CleanerPage from "@/components/profilePages/cleanerPage";
import CustomerPage from "@/components/profilePages/customerPage";
import { Button } from "@/components/ui/button";
import ContactInformation from "@/components/users/contactInformation";

export default function Profile() {
  const router = useRouter();
  const { user } = userStore();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const finishHydration = () => setHasHydrated(true);

    if (userStore.persist.hasHydrated()) {
      finishHydration();
    }

    const unsubscribe = userStore.persist.onFinishHydration(finishHydration);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (hasHydrated && !user) {
      router.replace("/");
    }
  }, [hasHydrated, router, user]);

  if (!hasHydrated || !user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-lg">Loading profile...</p>
      </div>
    );
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
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[max-content_minmax(0,1fr)]">
        <ContactInformation user={user} />
        <div className="min-w-0">
          {user.roles.includes("ROLE_USER") && <CustomerPage user={user as Customer} />}
          {user.roles.includes("ROLE_CLEANER") && <CleanerPage user={user as Cleaner} />}
        </div>
      </div>
    </div>
  );
}
