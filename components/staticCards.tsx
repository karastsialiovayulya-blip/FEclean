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

interface ServiceCard02Props {
  title: string;
  upper: string;
  icon: any;
}

export function Card01({
  title,
  description,
  icon: Icon,
  tags,
  variant = "light",
}: ServiceCardProps) {
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

export function Card02({ title, upper, icon }: ServiceCard02Props) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-white p-7 shadow-xs">
      <div className="bg-secondary text-primary rounded-lg p-3">
        <HugeiconsIcon icon={icon} />
      </div>
      <div>
        <p className="">{upper}</p>
        <h3 className="text-3xl font-bold">{title}</h3>
      </div>
    </div>
  );
}
