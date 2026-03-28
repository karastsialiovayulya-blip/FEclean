import React from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: any;
  tags: string[];
  variant?: "primary" | "light";
}

interface HeroSectionProps {
  h1: string;
  p: string;
  upperH1: any;
  image: string;
  highlight: string;
}

export function Card01 ({ title, description, icon: Icon, tags, variant = "light" }: ServiceCardProps) {
  const isPrimary = variant === "primary";
  const containerStyles = isPrimary ? "bg-primary text-white" : "bg-background text-foreground";
  const iconBgStyles = isPrimary ? "bg-white/10" : "bg-white shadow-sm";
  const textStyles = isPrimary ? "text-gray-300" : "text-muted-foreground";
  const buttonStyles = isPrimary
    ? "bg-white/10 border-white/20 hover:bg-white/20"
    : "bg-white border-gray-200 hover:bg-gray-50";

  return (
    <div
      className={`${containerStyles} w-full rounded-3xl p-10 shadow-lg transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="flex pb-10">
        <div className={`rounded-xl p-4 ${iconBgStyles}`}>
          <HugeiconsIcon icon={Icon} />
        </div>
      </div>
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className={`py-7 text-lg ${textStyles}`}>{description}</p>
      <div className="flex gap-3">
        {tags.map((tag) => (
          <Button
            key={tag}
            variant="outline"
            className={buttonStyles}
          >
            {tag}
          </Button>
        ))}
      </div>
    </div>
  );
}


export function HeroSection({ h1, p, image, upperH1, highlight }: HeroSectionProps) {
  const parts = h1?.toString().split(new RegExp(`(${highlight})`, "gi"));

  return (
    <>
      <section className="flex min-h-[90vh] px-20 py-30">
        <div className="w-[45%]">
          <Button
            size="normal"
            variant="secondary"
            className="mb-10 font-light uppercase"
          >
            {upperH1}
          </Button>
          <h1 className="text-7xl font-bold">
            {parts?.map((part, i) =>
              part.toLowerCase() === highlight.toLowerCase() ? (
                <span
                  key={i}
                  className="text-primary"
                >
                  {part}
                </span>
              ) : (
                part
              ),
            )}
          </h1>
          <p className="mt-7 text-3xl">{p}</p>
        </div>
        <div className="relative flex flex-1 justify-end">
          <div className="relative h-full w-[80%]">
            <Image
              src={image}
              fill={true}
              alt="hero image"
              className="rounded-2xl object-cover shadow-xl"
            />
          </div>
        </div>
      </section>
    </>
  );
}

