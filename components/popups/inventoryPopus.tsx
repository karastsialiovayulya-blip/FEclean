import { startTransition, useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { createInventory, editInventory } from "@/lib/actions";
import { CleanImage, Inventory } from "@/lib/types/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import BasePopup from "./basePopup";
import MediaPopup from "./media";

export default function InventoryPopup({
  inventory,
  setIsPopupOpen,
}: {
  inventory: Inventory | null;
  setIsPopupOpen: (open: boolean) => void;
}) {
  const [isMediaPopupOpen, setIsMediaPopupOpen] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<CleanImage | null>(null);
  const [stateCreate, createAction, isPendingCreate] = useActionState(createInventory, null);
  const [stateEdit, editAction, isPendingEdit] = useActionState(editInventory, null);

  const OnSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const dataToSend = {
      id: inventory ? inventory.id : null,
      name: formData.get("name"),
      description: formData.get("description"),
      amount: Number(formData.get("amount")),
      unit: formData.get("unit"),
      featuredImage: featuredImage,
    };

    startTransition(() => {
      if (inventory) editAction(dataToSend);
      else createAction(dataToSend);
    });
  };

  useEffect(() => {
    if (inventory) setFeaturedImage(inventory.featuredImage);
  }, []);

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
                defaultValue={inventory?.name}
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
                defaultValue={inventory?.description}
                placeholder="Type your description here."
                name="description"
                className="h-[10vh]"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <h3>Set amount</h3>
                <Input
                  defaultValue={inventory?.amount}
                  id="input-demo-api-key"
                  type="text"
                  placeholder="amount"
                  name="amount"
                  className="text-base"
                />
              </div>
              <div>
                <h3>Select unit</h3>
                <select
                  name="unit"
                  defaultValue={inventory?.unit}
                >
                  <option>pcs</option>
                  <option>ml</option>
                  <option>gr</option>
                </select>
              </div>
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
            {inventory
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
          isMultiple={false}
          setIsPopupOpen={setIsMediaPopupOpen}
          setSingleImage={setFeaturedImage}
        />
      )}
    </BasePopup>
  );
}
