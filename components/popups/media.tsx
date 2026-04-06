import { useEffect, useState } from "react";
import Image from "next/image";
import { CleanImage } from "@/lib/types/types";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import BasePopup from "./basePopup";

interface MediaPopupProps {
  isMultiple: boolean;
  setIsPopupOpen: (open: boolean) => void;
  setSingleImage: (image: CleanImage | null) => void;
  setSeveralImages?: (image: CleanImage[]) => void;
}

export default function MediaPopup({
  isMultiple,
  setIsPopupOpen,
  setSingleImage,
  setSeveralImages,
}: MediaPopupProps) {
  const [images, setImages] = useState<CleanImage[]>([]);
  const [selectedImages, setSelectecImages] = useState<number[]>([]);

  const onSelect = (id: number) => {
    if (selectedImages.includes(id)) {
      setSelectecImages(selectedImages.filter((i) => i !== id));
    } else {
      if (isMultiple) setSelectecImages((prevState) => [...prevState, id]);
      else setSelectecImages([id]);
    }
    console.log(selectedImages);
  };

  const onSelectImage = () => {
    if (isMultiple) {
      const nextImages: CleanImage[] = [];
      selectedImages.forEach((id) => {
        const foundImage = images.find((image) => image.id === id);
        if (foundImage) nextImages.push(foundImage);
      });
      if (setSeveralImages) setSeveralImages(nextImages);
    } else {
      setSingleImage(images.find((image) => image.id === selectedImages[0]) || null);
    }
    setIsPopupOpen(false);
  };

  useEffect(() => {
    async function getImages() {
      const responce = await fetch("http://localhost:8080/uploads/images", { method: "GET" });
      if (responce.ok) {
        const imagesData = await responce.json();
        setImages(imagesData);
      }
    }
    getImages();
  }, []);

  return (
    <BasePopup
      setIsPopupOpen={setIsPopupOpen}
      width="w-[60%]"
    >
      <div className="grid w-full grid-cols-5 gap-3">
        {images.map((image: CleanImage) => (
          <div
            key={image.id}
            className={cn(
              "rounded-lg bg-white p-3 transition-all hover:scale-105",
              selectedImages.includes(image.id) && "bg-secondary",
            )}
            onClick={() => onSelect(image.id)}
          >
            <div className="relative aspect-square w-full">
              <Image
                src={image.url}
                fill={true}
                alt={image.alt}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        ))}
      </div>
      <Button
        onClick={onSelectImage}
        size="normal"
        className="mx-[auto] mt-4"
      >
        Select
      </Button>
    </BasePopup>
  );
}
