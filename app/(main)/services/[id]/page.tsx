import { redirect } from "next/dist/server/api-utils";
import Image from "next/image";
import { getServiceById } from "@/lib/api/actions/service";
import { CleanImage, Service } from "@/lib/types/types";
import ServicePageInteractive from "@/components/servicePageInteractive";

export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) return;

  return (
    <div className="px-[15%]">
      <div className="flex gap-[10px]">
        {service.images.map((image: CleanImage) => (
          <Image
            src={image.url}
            alt={image.alt}
            width={100}
            height={100}
            key={image.id}
          />
        ))}
      </div>
      <ServicePageInteractive service={service} />
    </div>
  );
}
