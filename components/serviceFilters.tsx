"use client";

import { useState } from "react";
import Link from "next/link";
import { Category, Service } from "@/lib/types/types";
import { Button } from "@/components/ui/button";
import ImagesCarousel from "@/components/ui/imagesCarousel";
import { Input } from "@/components/ui/input";

type PricingFilter = "all" | "fixed" | "area-based";
type InventoryFilter = "all" | "with-inventory" | "without-inventory";

export default function ServiceFilters({
  initialServices,
  initialCategories,
}: {
  initialServices: Service[];
  initialCategories: Category[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [pricing, setPricing] = useState<PricingFilter>("all");
  const [maxDuration, setMaxDuration] = useState("");

  const categories = [...initialCategories].sort((a, b) => a.name.localeCompare(b.name));

  const types = Array.from(
    new Set(
      initialServices
        .map((service) => service.type?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const durationLimit = maxDuration ? Number(maxDuration) : null;

  const filteredServices = initialServices.filter((service) => {
    const searchValue = search.trim().toLowerCase();
    const matchesSearch =
      !searchValue ||
      service.name.toLowerCase().includes(searchValue) ||
      service.description.toLowerCase().includes(searchValue);

    const serviceCategories = service.categories ?? [];
    const serviceType = service.type?.trim() || "";
    const isAreaBased = service.depedensOnArea !== null;

    const matchesCategory =
      category === "all" ||
      serviceCategories.some((serviceCategory) => String(serviceCategory.id) === category);
    const matchesType = type === "all" || serviceType === type;
    const matchesPricing =
      pricing === "all" ||
      (pricing === "fixed" && !isAreaBased) ||
      (pricing === "area-based" && isAreaBased);
    const matchesDuration = durationLimit === null || service.time <= durationLimit;

    return matchesSearch && matchesCategory && matchesType && matchesPricing && matchesDuration;
  });

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setType("all");
    setPricing("all");
    setMaxDuration("");
  };

  return (
    <div className="flex w-full flex-col gap-5 xl:flex-row">
      <div className="w-full flex-1">
        <div className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold">Filter Services</h2>
              <p className="text-sm text-gray-500">
                Client-side filtering for the current catalog.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={resetFilters}
            >
              Reset
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="service-search"
              className="text-sm font-medium"
            >
              Search
            </label>
            <Input
              id="service-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name or description"
              className="h-10"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="service-category"
              className="text-sm font-medium"
            >
              Category
            </label>
            <select
              id="service-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border-input h-10 rounded-md border bg-white px-3 text-sm outline-none"
            >
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option
                  key={item.id}
                  value={String(item.id)}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="service-type"
              className="text-sm font-medium"
            >
              Type
            </label>
            <select
              id="service-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border-input h-10 rounded-md border bg-white px-3 text-sm outline-none"
            >
              <option value="all">All types</option>
              {types.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="service-pricing"
              className="text-sm font-medium"
            >
              Pricing model
            </label>
            <select
              id="service-pricing"
              value={pricing}
              onChange={(e) => setPricing(e.target.value as PricingFilter)}
              className="border-input h-10 rounded-md border bg-white px-3 text-sm outline-none"
            >
              <option value="all">All pricing</option>
              <option value="fixed">Fixed price</option>
              <option value="area-based">Area-based price</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="service-duration"
              className="text-sm font-medium"
            >
              Max duration (minutes)
            </label>
            <Input
              id="service-duration"
              type="number"
              min="0"
              value={maxDuration}
              onChange={(e) => setMaxDuration(e.target.value)}
              placeholder="Any duration"
              className="h-10"
            />
          </div>

          <div className="bg-background rounded-xl p-4 text-sm">
            <span className="font-semibold">{filteredServices.length}</span> of{" "}
            <span className="font-semibold">{initialServices.length}</span> services shown
          </div>
        </div>
      </div>

      <div className="grid flex-3 grid-cols-1 items-start gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div
              key={service.id}
              className="group flex h-fit flex-col self-start overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="overflow-hidden">
                <ImagesCarousel service={service} />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 transition group-hover:text-green-700">
                      {service.name}
                    </h3>
                    {(service.categories.length > 0 || service.type) && (
                      <p className="mt-1 text-xs tracking-[0.2em] text-gray-400 uppercase">
                        {[service.categories.map((item) => item.name).join(", "), service.type]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    )}
                  </div>

                  <div className="text-right text-lg font-bold text-green-600">
                    {service.depedensOnArea && "From "}
                    {service.price}$
                  </div>
                </div>

                <p className="mt-3 line-clamp-3 text-sm text-gray-500">{service.description}</p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="bg-background rounded-full px-3 py-1">{service.time} min</span>
                  <span className="bg-background rounded-full px-3 py-1">
                    {service.depedensOnArea !== null ? "Area-based" : "Fixed price"}
                  </span>
                </div>

                <div className="mt-auto pt-5">
                  <Link href={"/services/" + service.id}>
                    <Button
                      size="normal"
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full rounded-2xl bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-semibold">No services match these filters</h3>
            <p className="mt-2 text-sm text-gray-500">
              Try widening the search, removing category limits, or resetting the panel.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
