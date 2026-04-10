import Image from "next/image";
import { CleanImage, Service } from "@/lib/types/types";

async function getServiceById(id: string) {
  const responce = await fetch("http://localhost:8080/services/" + id, { method: "GET" });
  if (responce.ok) {
    return await responce.json();
  } else return null;
}

export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service: Service = await getServiceById(id);

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
    </div>
  );
}
