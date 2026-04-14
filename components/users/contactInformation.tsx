import { AnyUser } from "@/lib/types/types";
import { Location03Icon, MailEdit01Icon, TelephoneIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

export default function ContactInformation({ user }: { user: AnyUser }) {
  return (
    <aside className="w-fit min-w-max">
      <section className="flex flex-col gap-5 rounded-xl bg-white p-8 transition-all duration-300">
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
              <p className="font-medium">{user.phone}</p>
            </div>
          </div>
          {"address" in user && user.roles.includes("ROLE_USER") && (
            <div className="flex items-center gap-4">
              <HugeiconsIcon
                className="text-primary/60"
                icon={Location03Icon}
              />
              <div>
                <p className="text-xs font-semibold tracking-wider uppercase">Primary Residence</p>
                <p className="font-medium">{user.address}</p>
              </div>
            </div>
          )}
        </div>
        <Button
          size="normal"
          variant="secondary"
        >
          Edit Profile
        </Button>
      </section>
    </aside>
  );
}
