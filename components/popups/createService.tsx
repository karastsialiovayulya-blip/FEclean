"use client";
import { startTransition, useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { createService, editService } from "@/lib/actions";
import { CleanImage, Service } from "@/lib/types/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import BasePopup from "./basePopup";
import MediaPopup from "./media";

export default function CreateService({
  service,
  setIsPopupOpen,
}: {
  service: Service | null;
  setIsPopupOpen: (open: boolean) => void;
}) {
  const [isMediaMultiple, setIsMediaMultiple] = useState(false);
  const [isMediaPopupOpen, setIsMediaPopupOpen] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<CleanImage | null>(null);
  const [images, setImages] = useState<CleanImage[]>([]);
  const [stateCreate, createAction, isPendingCreate] = useActionState(createService, null);
  const [stateEdit, editAction, isPendingEdit] = useActionState(editService, null);

  useEffect(() => {
    if (service) {
      setFeaturedImage(service.featuredImage);
      setImages(service.images);
    }
  }, []);

  const OnSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const dataToSend = {
      id: service ? service.id : null,
      name: formData.get("name"),
      description: formData.get("description"),
      time: Number(formData.get("time")),
      price: Number(formData.get("price")),
      featuredImage: featuredImage,
      images: images,
      depedensOnArea: null,
    };

    if (service) {
      startTransition(() => {
        editAction(dataToSend);
      });
    } else {
      startTransition(() => {
        createAction(dataToSend);
      });
    }
  };

  useEffect(() => {
    if (stateCreate?.success || stateEdit?.success) setIsPopupOpen(false);
  }, [stateCreate, stateEdit]);

  return (
    <BasePopup
      setIsPopupOpen={setIsPopupOpen}
      width="w-[30vw]"
    >
      <form onSubmit={OnSubmit}>
        <div className="flex flex-col gap-5">
          {featuredImage ? (
            <div className="justify center flex h-[15vh] w-full">
              <div
                className="relative size-[15vh]"
                onClick={() => setFeaturedImage(null)}
              >
                <Image
                  src={featuredImage.url}
                  fill={true}
                  alt={featuredImage.alt}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          ) : (
            <label
              onClick={() => {
                setIsMediaPopupOpen(true);
                setIsMediaMultiple(false);
              }}
              className={cn(
                "flex h-[15vh] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white transition-colors hover:bg-gray-100",
              )}
            >
              <div className="flex flex-col items-center justify-center">
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Set featured image</span>
                </p>
              </div>
            </label>
          )}
          <div className="flex flex-col gap-3">
            <div>
              <h3>Set name</h3>
              <Input
                defaultValue={service?.name}
                id="input-demo-api-key"
                type="text"
                placeholder="name"
                name="name"
                className="text-base"
              />
            </div>
            <div>
              <h3>Set description</h3>
              <Textarea
                defaultValue={service?.description}
                placeholder="Type your description here."
                name="description"
                className="h-[10vh]"
              />
            </div>
            <div>
              <h3>Set time (in minutes)</h3>
              <Input
                defaultValue={service?.time}
                id="input-demo-api-key"
                type="text"
                placeholder="time"
                name="time"
                className="text-base"
              />
            </div>
            <div>
              <h3>Set price</h3>
              <Input
                defaultValue={service?.price}
                id="input-demo-api-key"
                type="text"
                placeholder="price"
                name="price"
                className="text-base"
              />
            </div>
            <div className="flex gap-2">
              <input type="checkbox" />
              <span>Depends on area</span>
            </div>
            <div>
              <h3>Select images</h3>
              {images.length > 0 ? (
                <div className="flex w-full gap-3 overflow-x-auto">
                  {images.map((image) => (
                    <div
                      className="relative size-[10vh] flex-shrink-0"
                      key={image.id}
                      onClick={() => setImages(images.filter((i) => i.id !== image.id))}
                    >
                      <Image
                        src={image.url}
                        fill={true}
                        alt={image.alt}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <label
                  onClick={() => {
                    setIsMediaPopupOpen(true);
                    setIsMediaMultiple(true);
                  }}
                  className={cn(
                    "flex size-[10vh] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white transition-colors hover:bg-gray-100",
                  )}
                >
                  <div className="flex flex-col items-center justify-center">
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Set images</span>
                    </p>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-center">
          <Button
            size="normal"
            className="w-full"
            type="submit"
            disabled={isPendingEdit || isPendingCreate}
          >
            {service
              ? isPendingEdit
                ? "...Updating"
                : "Edit"
              : isPendingCreate
                ? "...Creating"
                : "Add"}
          </Button>
        </div>
      </form>
      {isMediaPopupOpen && (
        <MediaPopup
          isMultiple={isMediaMultiple}
          setIsPopupOpen={setIsMediaPopupOpen}
          setSingleImage={setFeaturedImage}
          setSeveralImages={setImages}
        />
      )}
    </BasePopup>
  );
}
