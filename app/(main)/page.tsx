import Image from "next/image";
import Link from "next/link";
import {
  Audit02Icon,
  ClinicIcon,
  EcoEnergyIcon,
  HealtcareIcon,
  MentoringIcon,
  Plant01Icon,
  Plant04Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card01 } from "@/components/staticCards";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <section className="flex px-20 py-20">
        <div className="w-[55%]">
          <Button
            size="normal"
            variant="secondary"
            className="mb-10 font-light uppercase"
          >
            Premium Clinical Care
          </Button>
          <h1 className="text-9xl font-bold">
            The Science of <span className="text-primary">Pristine.</span>
          </h1>
          <p className="mt-7 text-4xl">
            Experience clinical-grade precision blended with botanical luxury. We don't just
            clean—we restore your home's natural equilibrium.
          </p>
          <div className="mt-15 flex gap-5">
            <Button
              size="normal"
              className="rounded-2xl px-10 py-5"
            >
              Schedule Appointment
            </Button>
            <Button
              size="normal"
              className="rounded-2xl bg-white px-10 py-5"
              variant="outline"
            >
              View Menu
            </Button>
          </div>
          <div className="py-10">
            <hr className="w-[50%] border" />
          </div>
          <h4>Trusted by 2,400+ luxury homeowners</h4>
        </div>
        <div className="flex-schrink relative flex flex-1 justify-end">
          <div className="h-[90%] w-[90%] rounded-2xl bg-white p-5 shadow-sm">
            <div className="relative size-full">
              <Image
                src="/hero-image.png"
                fill={true}
                alt="hero image"
                className="rounded-2xl object-cover"
              />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 flex items-center gap-3 rounded-2xl bg-white p-7 shadow-xl">
            <div className="bg-secondary text-primary rounded-2xl p-3">
              <HugeiconsIcon icon={Plant04Icon} />
            </div>
            <div>
              <p className="text-xs uppercase">Clinical-Eco</p>
              <h3>100% Non-Toxic</h3>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white px-20 py-30">
        <div className="flex items-end justify-between">
          <div>
            <Button
              size="normal"
              variant="secondary"
              className="mb-3 font-light uppercase"
            >
              Our Philosophy
            </Button>
            <h2 className="text-6xl font-bold">
              Beyond Clean.
              <br /> Clinical
              <br /> Excellence.
            </h2>
          </div>
          <div className="w-[20%] border-l pl-2">
            <p className="text-xl">
              Merging rigorous medical standards with environmental ethics to create unparalleled
              living sanctuaries.
            </p>
          </div>
        </div>
        <div className="mt-20 grid grid-cols-3 gap-15">
          <Card01
            title="Clinical Grade"
            description="We apply medical-grade cleaning protocols and color-coded microfiber systems to
              eliminate 99.9% of pathogens and prevent cross-contamination between areas."
            icon={ClinicIcon}
            tags={["HEPA 13", "UV-C Sanitation"]}
            variant="light"
          />
          <Card01
            title="Botanical Essence"
            description="Your safety is our priority. We use hospital-standard cleaning methods and dedicated
              tools for every zone, ensuring 99.9% of germs are gone without spreading them around."
            icon={Plant01Icon}
            tags={["Non-Toxic", "Biodegradable"]}
            variant="primary"
          />
          <Card01
            title="Curated Care"
            description="We offer a bespoke approach to managing your space’s inventory and organization. Our
              team ensures every item is perfectly placed, creating harmony and functional order in
              every corner."
            icon={HealtcareIcon}
            tags={["Auto-Restock", "Organization"]}
            variant="light"
          />
        </div>
      </section>
      <section className="grid grid-cols-2 gap-20 px-20 py-20">
        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col gap-10">
            <div className="relative aspect-square w-full">
              <Image
                src="/m1.png"
                fill={true}
                alt="M1"
                className="rounded-3xl shadow-xl"
              />
            </div>
            <div className="relative aspect-2/3 w-full">
              <Image
                src="/m2.png"
                fill={true}
                alt="M2"
                className="rounded-3xl shadow-xl"
              />
            </div>
          </div>
          <div className="flex flex-col gap-10">
            <div className="relative aspect-2/3 w-full">
              <Image
                src="/m3.png"
                fill={true}
                alt="M2"
                className="rounded-3xl shadow-xl"
              />
            </div>
            <div className="relative aspect-square w-full">
              <Image
                src="/m4.png"
                fill={true}
                alt="M1"
                className="rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div>
            <Button
              size="normal"
              variant="secondary"
              className="mb-3 font-light uppercase"
            >
              Our Philosophy
            </Button>
            <h2 className="text-6xl font-bold">
              Your Home
              <br />
              Perfectly <br />
              Refined.
            </h2>
            <p className="py-10 text-3xl">
              We believe a clean home is the foundation of mental clarity. Our service goes beyond
              the visual, addressing the microscopic environment to improve air quality and sensory
              harmony.
            </p>
            <div className="py-7">
              <hr className="border" />
            </div>
            <div className="grid grid-cols-2">
              <div>
                <h4 className="text-primary text-5xl font-bold">98.4%</h4>
                <h5 className="uppercase">Renewal Rate</h5>
              </div>
              <div>
                <h4 className="text-primary text-5xl font-bold">15k+</h4>
                <h5 className="uppercase">Sanctuary Hours</h5>
              </div>
            </div>
            <Link
              href="/"
              className="text-primary mt-12 block text-xl font-bold"
            >
              Our Methodical Approach →
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-white px-30 py-30">
        <h3 className="mb-2 text-center font-light uppercase">The Journey</h3>
        <h2 className="text-center text-6xl font-bold">The Path to Serenity</h2>
        <div className="mt-30 grid grid-cols-1 gap-8 px-4 md:grid-cols-3">
          <div className="flex flex-col items-center px-5 text-center">
            <div className="mb-7 rounded-2xl bg-green-800 p-5 text-white shadow-xl">
              <HugeiconsIcon icon={MentoringIcon} />
            </div>
            <h3 className="mb-3 text-3xl font-bold text-gray-900">Custom Consult</h3>
            <p className="text-xl">
              Digital concierge analysis to map your home's unique botanical and structural needs.
            </p>
          </div>

          <div className="flex flex-col items-center px-5 text-center">
            <div className="mb-7 rounded-2xl bg-green-800 p-5 text-white shadow-xl">
              <HugeiconsIcon icon={EcoEnergyIcon} />
            </div>
            <h3 className="mb-3 text-3xl font-bold text-gray-900">Clinical Execution</h3>
            <p className="text-xl">
              Specialists execute your personalized blueprint using surgical precision and
              eco-certified solutions.
            </p>
          </div>

          <div className="flex flex-col items-center px-5 text-center">
            <div className="mb-7 rounded-2xl bg-green-800 p-5 text-white shadow-xl">
              <HugeiconsIcon icon={Audit02Icon} />
            </div>
            <h3 className="mb-3 text-3xl font-bold text-gray-900">Sanctuary Audit</h3>
            <p className="text-xl">
              Final verification of air quality and surface purity with a detailed digital care
              report.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
