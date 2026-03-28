import { Mail01Icon, TelephoneIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { HeroSection } from "@/components/staticCards";

const ContactInfoCard = ({ icon, title, children }: any) => (
  <div className="bg-background2 flex flex-col gap-4 rounded-lg p-8">
    <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-lg">
      <HugeiconsIcon icon={icon} />
    </div>
    <div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  </div>
);

export default function ContactUs() {
  return (
    <>
      <HeroSection
        h1="Purity is just a conversation away."
        p="Whether you are looking for a clinical deep clean or routine sanctuary maintenance, our specialists are here to tailor a plan for your unique space."
        upperH1="Get in Touch"
        image="/minhome.jpg"
        highlight="conversation"
      />
      <section className="mx-auto grid grid-cols-2 gap-8 p-6 px-[15%] py-20">
        <div className="flex flex-col gap-6">
          <ContactInfoCard
            icon={TelephoneIcon}
            title="Speak with us"
          >
            <p>Monday – Friday, 8am – 6pm</p>
            <p className="text-lg font-bold text-[#2d4a3e]">+1 (800) LUMINA-CLN</p>
          </ContactInfoCard>
          <ContactInfoCard
            icon={Mail01Icon}
            title="Write to us"
          >
            <p>We reply within 2 hours</p>
            <p className="text-lg font-bold text-[#2d4a3e] underline">hello@luminaclean.com</p>
          </ContactInfoCard>
          <div className="flex gap-5 rounded-lg border border-gray-100 bg-white p-8 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
              <HugeiconsIcon icon={TelephoneIcon} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1a1a1a]">Our Showroom</h3>
              <p className="text-gray-500">
                882 Sage Botanical Heights,
                <br />
                Suite 400, Portland, OR 97204
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-50 bg-white p-10 shadow-sm">
          <h2 className="mb-10 text-4xl font-bold text-[#1a1a1a]">Send a Message</h2>
          <form className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  className="bg-background w-full rounded-lg border-none p-4 outline-none focus:ring-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="jane@example.com"
                  className="bg-background w-full rounded-lg border-none p-4 outline-none focus:ring-2"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
                Service Interest
              </label>
              <div className="relative">
                <select className="bg-background w-full cursor-pointer appearance-none rounded-lg border-none p-4 outline-none focus:ring-2">
                  <option>Residential Clinical Clean</option>
                  <option>Commercial Space</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
                Your Message
              </label>
              <textarea
                rows={4}
                placeholder="How can we help restore your sanctuary?"
                className="bg-background w-full resize-none rounded-lg border-none p-4 outline-none focus:ring-2"
              />
            </div>
            <button className="rounded-lg bg-[#2d4a3e] px-10 py-4 font-bold text-white transition-colors duration-200 hover:bg-[#1f332a]">
              Send Request
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
