import Image from "next/image";
import { ClinicIcon, HealtcareIcon, Plant01Icon } from "@hugeicons/core-free-icons";
import { HeroSection } from "@/components/sections/heroSections";
import { Card01 } from "@/components/staticCards";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <>
      <HeroSection
        h1="Where clinical precision meets botanical soul. The
            Science of"
        p=" We don't just clean spaces; we curate environments of health and serenity. Lumina Clean
            was born from the belief that clinical purity shouldn't come at the cost of our planet's
            wellbeing."
        upperH1="ESTABLISHED 2018"
        image="/plant.webp"
        highlight="precision"
      />
      <section className="grid grid-cols-2 gap-20 px-20 py-20">
        <div className="relative aspect-square w-full">
          <Image
            src="/cleaners.webp"
            fill={true}
            alt="M1"
            className="rounded-3xl object-cover shadow-xl"
          />
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
            <h2 className="text-6xl font-bold">Our Story</h2>
            <p className="py-10 text-3xl">
              Lumina Clean began in a small garden studio, fueled by a simple frustration: why do
              the strongest cleaners smell like chemicals and damage our lungs? We spent years
              partnering with biochemists to develop a proprietary line of clinical-grade solutions
              infused with plant-based botanical essences.
            </p>
            <p className="text-3xl">
              Today, we serve the city's most discerning homes and workspaces, delivering a level of
              purity that is felt as much as it is seen. We treat every surface like a canvas and
              every room like a sanctuary.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-white px-30 py-30">
        <h3 className="mb-2 text-center font-light uppercase">The Pillars</h3>
        <h2 className="text-center text-6xl font-bold">The Lumina Standard</h2>
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
    </>
  );
}
