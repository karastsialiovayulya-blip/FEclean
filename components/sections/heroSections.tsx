import React from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  h1: string;
  p: string;
  upperH1: any;
  image?: string;
  highlight: string;
  children?: React.ReactNode;
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
            {image && (
              <Image
                src={image}
                fill={true}
                alt="hero image"
                className="rounded-2xl object-cover shadow-xl"
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export function DashboardDescription({ h1, p, upperH1, highlight, children }: HeroSectionProps) {
  const parts = h1?.toString().split(new RegExp(`(${highlight})`, "gi"));

  return (
    <div className="flex items-end justify-between">
      <div className="w-[60%]">
        <h3 className="text-primary mb-4 font-light uppercase">{upperH1}</h3>
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
        <p className="mt-3 text-2xl">{p}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}
