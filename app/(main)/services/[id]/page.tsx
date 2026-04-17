import { redirect } from "next/dist/server/api-utils";
import Image from "next/image";
import { getServiceById } from "@/lib/api/actions/service";
import { CleanImage, Service } from "@/lib/types/types";
import ServicePageInteractive from "@/components/servicePageInteractive";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function formatLabel(label: string) {
  return label
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/^./, (char) => char.toUpperCase());
}

function renderValue(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return String(value);
}

export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) return;

  const title = service.name || `Service #${service.id}`;
  const description = service.description || "No description available for this service.";
  const price = service.price;
  const category = service.category || service.type || "Service";
  const mainImage: CleanImage | undefined = service.featuredImage || service.images?.[0];
  const galleryImages = service.images?.filter((image) => image.id !== mainImage?.id) ?? [];

  const details = Object.entries(service).filter(
    ([key]) =>
      ![
        "id",
        "images",
        "featuredImage",
        "title",
        "name",
        "description",
        "summary",
        "category",
        "type",
        "price",
      ].includes(key),
  );

  return (
    <main className="px-[10%] py-10">
      <section>
        <div className="flex gap-5">
          <div className="group relative flex-1">
            <div className="bg-surface-container-low absolute -top-6 -left-6 -z-10 h-full w-full rounded-xl"></div>
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={mainImage.alt}
                width={600}
                height={600}
                className="h-[600px] w-full rounded-xl object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-[600px] w-full items-center justify-center rounded-xl bg-gray-100">
                No image available
              </div>
            )}
            {galleryImages.length > 0 && (
              <div className="mt-4 flex w-full gap-4 overflow-x-auto">
                {galleryImages.map((image: CleanImage) => (
                  <div
                    key={image.id}
                    className="relative aspect-square w-32 overflow-hidden"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill={true}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col space-y-8">
            <div className="space-y-4">
              <span className="text-primary font-label text-sm font-bold tracking-[0.05em] uppercase">
                {category}
              </span>
              <h1 className="font-headline text-on-surface text-5xl leading-[1.1] font-extrabold tracking-tight md:text-6xl">
                {title}
              </h1>
              <p className="text-on-surface-variant text-lg leading-relaxed">{description}</p>
            </div>
            <div className="space-y-6">
              <ServicePageInteractive
                service={service}
                price={price}
              />
            </div>
            <article className="rounded-[2rem]">
              <h2 className="text-2xl font-semibold text-slate-900">Full service information</h2>
              <div className="mt-6">
                <Accordion
                  type="multiple"
                  className="border-0"
                >
                  {details.map(([key, value]) => (
                    <AccordionItem
                      key={key}
                      value={key}
                    >
                      <AccordionTrigger className="text-lg">{formatLabel(key)}</AccordionTrigger>
                      <AccordionContent>{renderValue(value)}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
