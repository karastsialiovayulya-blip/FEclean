"use client";
import { startTransition, useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { createService, editService, getServicesCategoriesAPI } from "@/lib/api/actions/service";
import { Category, CleanImage, Service } from "@/lib/types/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import AddCategory from "./addCategory";
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
  const [isCategoryPopupOpen, setCategoryPopupOpen] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<CleanImage | null>(null);
  const [images, setImages] = useState<CleanImage[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    service?.categories ?? [],
  );
  const [isDependsOnArea, setIsDependsOnArea] = useState(service?.depedensOnArea !== null);
  const [stateCreate, createAction, isPendingCreate] = useActionState(createService, null);
  const [stateEdit, editAction, isPendingEdit] = useActionState(editService, null);

  useEffect(() => {
    if (service) {
      setFeaturedImage(service.featuredImage);
      setImages(service.images);
      setSelectedCategories(service.categories ?? []);
    }
  }, [service]);

  useEffect(() => {
    async function loadCategories() {
      const categories = await getServicesCategoriesAPI();
      setAvailableCategories(categories);
    }

    loadCategories();
  }, [isCategoryPopupOpen]);

  const toggleCategory = (category: Category) => {
    setSelectedCategories((currentCategories) => {
      const isSelected = currentCategories.some((item) => item.id === category.id);

      if (isSelected) {
        return currentCategories.filter((item) => item.id !== category.id);
      }

      return [...currentCategories, category];
    });
  };

  const OnSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const dataToSend = {
      id: service ? service.id : undefined,
      name: formData.get("name"),
      description: formData.get("description"),
      time: Number(formData.get("time")),
      price: Number(formData.get("price")),
      featuredImage: featuredImage,
      images: images,
      categories: selectedCategories,
      depedensOnArea: formData.get("depedensOnArea")
        ? Number(formData.get("depedensOnArea"))
        : null,
      priceForAdditionalMeter: formData.get("priceForAdditionalMeter")
        ? Number(formData.get("priceForAdditionalMeter"))
        : null,
    };

    if (service) {
      startTransition(() => {
        editAction(dataToSend);
        console.log(stateEdit);
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
      width="w-[50vw]"
    >
      <form onSubmit={OnSubmit}>
        <div className="grid grid-cols-2 gap-7">
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
                {isDependsOnArea && (
                  <p className="pt-1 text-xs">
                    * if depends on area set for minimum (time will be calculate automatically)
                  </p>
                )}
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
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex gap-2">
              <input
                type="checkbox"
                checked={isDependsOnArea}
                onChange={(e) => setIsDependsOnArea(e.target.checked)}
              />
              <span>Depends on area</span>
            </div>
            {isDependsOnArea && (
              <>
                <div>
                  <h3>Set minimum area required </h3>
                  <Input
                    defaultValue={service?.depedensOnArea ?? undefined}
                    id="input-demo-api-key"
                    type="text"
                    placeholder="Depends on ares"
                    name="depedensOnArea"
                    className="text-base"
                  />
                </div>
                <div>
                  <h3>Set price for additional meter </h3>
                  <Input
                    defaultValue={service?.priceForAdditionalMeter ?? undefined}
                    id="input-demo-api-key"
                    type="text"
                    placeholder="price for additional meter"
                    name="priceForAdditionalMeter"
                    className="text-base"
                  />
                </div>
              </>
            )}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <h3>Select categories</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCategoryPopupOpen(true)}
                >
                  Add category
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableCategories.length > 0 ? (
                  availableCategories.map((category) => {
                    const isSelected = selectedCategories.some((item) => item.id === category.id);

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-border text-foreground bg-white hover:bg-gray-100",
                        )}
                      >
                        {category.name}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">No categories available yet.</p>
                )}
              </div>
              {selectedCategories.length > 0 && (
                <p className="text-sm text-gray-500">
                  Selected: {selectedCategories.map((category) => category.name).join(", ")}
                </p>
              )}
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
            className="w-[40%]"
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
      {isCategoryPopupOpen && <AddCategory setIsPopupOpen={setCategoryPopupOpen} />}
    </BasePopup>
  );
}
