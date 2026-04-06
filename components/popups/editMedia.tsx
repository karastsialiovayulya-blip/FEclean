import { CleanImage } from "@/lib/types/types";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import BasePopup from "./basePopup";

export default function EditMedia({
  imageToEdit,
  setIsPopupOpen,
}: {
  imageToEdit: CleanImage;
  setIsPopupOpen: (open: boolean) => void;
}) {
  return (
    <BasePopup
      setIsPopupOpen={setIsPopupOpen}
      width="w-[50vw]"
    >
      <div className="flex gap-3">
        <div className="flex w-[70%] justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageToEdit.url}
            alt={imageToEdit.alt}
            className="aspect-auto h-auto"
          />
        </div>
        <div className="flex flex-col gap-5">
          <div>
            <FieldLabel
              htmlFor="input-demo-api-key"
              className="ml-1 text-base"
            >
              Alt:{" "}
            </FieldLabel>
            <Input
              type="text"
              placeholder="alt"
              name="alt"
              className="block w-[15vw] text-base"
              defaultValue={imageToEdit.alt}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Button
              size="normal"
              className="w-full"
            >
              Save
            </Button>
            <Button
              variant="destructive"
              size="normal"
              className="w-full"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </BasePopup>
  );
}
