import Image from "next/image";
import { getServiceById } from "@/lib/api/actions/service";
import { CleanImage, Service } from "@/lib/types/types";

export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getServiceById(id);

  return (
    <div className="px-[15%]">
      <div className="flex gap-[10px]">
        {service &&
          service.images.map((image: CleanImage) => (
            <Image
              src={image.url}
              alt={image.alt}
              width={100}
              height={100}
              key={image.id}
            />
          ))}
      </div>
    </div>
  );
}
