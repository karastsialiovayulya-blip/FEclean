import { Customer } from "@/lib/types/types";
import { Location03Icon, MailEdit01Icon, TelephoneIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

export default function CustomerPage({ user }: { user: Customer }) {
  return (
    <div className="w-full">
      <div>
        <h2 className="text-2xl font-bold">Upcoming Appointments</h2>
        <div className="my-6">
          <div className="rounded-xl bg-white p-8"></div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold">Order history</h2>
        <div className="mt-6">
          <div className="rounded-xl bg-white p-8"></div>
        </div>
      </div>
    </div>
  );
}
