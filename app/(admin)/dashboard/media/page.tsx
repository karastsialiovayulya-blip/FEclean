"use client";

import { useEffect, useState } from "react";
import { startTransition, useActionState } from "react";
import Image from "next/image";
import { deleteImagesAction, uploadImageAction } from "@/lib/actions";
import { CleanImage } from "@/lib/types/types";
import { cn } from "@/lib/utils";
import MultipleDelete from "@/components/multipleDelete";
import EditMedia from "@/components/popups/editMedia";
import { DashboardDescription } from "@/components/sections/heroSections";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function Media() {
  const [preview, setPreview] = useState("");
  const [images, setImages] = useState<CleanImage[]>([]);
  const [state, formAction, isPending] = useActionState(uploadImageAction, null);
  const [deleteState, deleteAction, isDeletePending] = useActionState(deleteImagesAction, null);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [isSelectedMode, setSelectedMode] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<CleanImage | boolean>(false);

  const onSelect = (id: number) => {
    if (isSelectedMode) {
      if (selectedImages.includes(id)) {
        setSelectedImages(selectedImages.filter((i) => i !== id));
      } else setSelectedImages((prevState) => [...prevState, id]);
      console.log(selectedImages);
    } else setImageToEdit(images.find((image) => image.id === id) || false);
  };

  const onDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const cancelUploading = () => {
    setPreview("");
  };

  const deleteImages = async () => {
    startTransition(() => {
      deleteAction(selectedImages);
    });
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
  }, [deleteState, state]);

  useEffect(() => {
    if (state?.success) setPreview("");
  }, [state]);

  return (
    <div className="p-10">
      <DashboardDescription
        h1="Curated Visual Assets"
        p="Upload high-quality images to make your service stand out in the catalog. The first image will be set as the primary cover. You can drag and drop your files here or browse your local storage."
        upperH1="Media Management"
        highlight="Visual"
      >
        <div className="mt-5 flex h-[20vh] w-full gap-5">
          <form
            action={formAction}
            className="flex gap-3 rounded-lg border-2 bg-white p-3 text-base"
          >
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className={cn(
                "flex w-[40%] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white transition-colors hover:bg-gray-100",
                preview && "hidden",
              )}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span>
                </p>
                <p className="text-center text-xs text-gray-400">PNG, JPG or GIF (MAX. 2MB)</p>
              </div>
              <input
                onChange={onChangeInput}
                id="dropzone-file"
                type="file"
                name="file"
                className="hidden"
                accept="image/*"
              />
            </label>
            {preview && (
              <div className="relative aspect-square h-full">
                <Image
                  src={preview}
                  alt="Preview"
                  fill={true}
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex w-[50%] flex-col gap-3">
              <Field className="gap-0">
                <FieldLabel
                  htmlFor="input-demo-api-key"
                  className="ml-1 text-base"
                >
                  Alt{" "}
                </FieldLabel>
                <Input
                  id="input-demo-api-key"
                  type="text"
                  placeholder="alt"
                  name="alt"
                  className="text-base"
                />
              </Field>
              {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
              <div className="flex gap-1">
                <Button
                  type="submit"
                  className="flex-1 text-base"
                  size="normal"
                  disabled={isPending}
                >
                  {isPending ? "Uploading..." : "Upload"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="flex-1 text-base"
                  onClick={cancelUploading}
                  size="normal"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DashboardDescription>
      <MultipleDelete
        isSelectedMode={isSelectedMode}
        setSelectedMode={setSelectedMode}
        setSelected={setSelectedImages}
        deleteSelected={deleteImages}
      />
      <div className="bg-background2 flex flex-col gap-3 rounded-lg p-5">
        {images.length > 0 ? (
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
        ) : (
          <div className="flex justify-center py-10">No images found</div>
        )}
      </div>
      {typeof imageToEdit !== "boolean" && (
        <EditMedia
          imageToEdit={imageToEdit}
          setIsPopupOpen={setImageToEdit}
        />
      )}
    </div>
  );
}
