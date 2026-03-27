"use client";

import { useEffect, useState } from "react";
import { startTransition, useActionState } from "react";
import Image from "next/image";
import { uploadImageAction } from "@/lib/actions";
import { CleanImage } from "@/lib/types/types";
import { cn } from "@/lib/utils";
import { Cancel01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function Media() {
  const [preview, setPreview] = useState("");
  const [images, setImages] = useState<CleanImage[]>([]);
  const [state, formAction, isPending] = useActionState(uploadImageAction, null);
  const [selectedImages, setSelectecImages] = useState<number[]>([]);
  const [isSelectedMode, setSelectedMode] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<CleanImage | null>(null);

  const onSelect = (id: number) => {
    if (isSelectedMode) {
      if (selectedImages.includes(id)) {
        setSelectecImages(selectedImages.filter((i) => i !== id));
      } else setSelectecImages((prevState) => [...prevState, id]);
      console.log(selectedImages);
    } else setImageToEdit(images.find((image) => image.id === id) || null);
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
    const responce = await fetch("http://localhost:8080/uploads/images", {
      method: "DELETE",
      body: JSON.stringify(selectedImages),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (responce.ok) {
      console.log("images deleted");
    }
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
  }, [state]);

  useEffect(() => {
    startTransition(() => {
      setPreview("");

      const formData = new FormData();
      formData.append("actionType", "reset");
      formAction(formData);
    });
  }, [state?.success, formAction]);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-semibold">Lumina Clean - Media</h1>
      <p className="mt-2 w-[60%]">
        Manage your digital assets in one place. Upload and store your images here to build your
        personal gallery. Supports high-quality PNG, JPG, or GIF up to 2MB. Simply drag and drop
        your files or click the area above to get started.
      </p>
      <div className="mt-5 flex h-[20vh] w-full gap-5">
        <form
          action={formAction}
          className="flex w-[35%] gap-3 rounded-lg border-2 bg-white p-3 text-base"
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
              <p className="text-xs text-gray-400">PNG, JPG or GIF (MAX. 2MB)</p>
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
      <div className="flex items-end justify-between py-2">
        <div className="flex items-center gap-1">
          <Switch
            checked={isSelectedMode}
            onClick={() => {
              setSelectedMode(!isSelectedMode);
              setSelectecImages([]);
            }}
          />
          <p>Selecting mode</p>
        </div>
        <Button
          onClick={deleteImages}
          variant="destructive"
          size="normal"
          className="flex items-center gap-1"
        >
          <HugeiconsIcon icon={Delete02Icon} />
          Delete
        </Button>
      </div>
      <div className="flex flex-col gap-3 rounded-lg border-2 bg-white p-3">
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
      </div>
      {imageToEdit && (
        <div className="fixed top-0 left-[20%] flex h-screen w-[80%] items-center justify-center bg-gray-700/20 backdrop-blur-sm">
          <div className="relative max-h-[75vh] max-w-[70%] p-5">
            <div
              className="absolute top-3 right-3 z-10 rounded-full bg-red-500 p-1 text-white"
              onClick={() => setImageToEdit(null)}
            >
              <HugeiconsIcon icon={Cancel01Icon} />
            </div>
            <div className="flex h-auto gap-2 rounded-lg bg-white p-5">
              <div className="flex w-[100%] justify-center">
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
                    value={imageToEdit.alt}
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
          </div>
        </div>
      )}
    </div>
  );
}
