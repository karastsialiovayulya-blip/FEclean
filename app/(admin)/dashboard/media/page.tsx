"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { deleteImagesAction, getImagesAPI, uploadImageAction } from "@/lib/api/actions/image";
import { CleanImage } from "@/lib/types/types";
import { cn } from "@/lib/utils";
import MultipleDelete from "@/components/multipleDelete";
import EditMedia from "@/components/popups/editMedia";
import { DashboardDescription } from "@/components/sections/heroSections";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const MEDIA_PER_PAGE = 15;

export default function Media() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [images, setImages] = useState<CleanImage[]>([]);
  const [state, formAction, isPending] = useActionState(uploadImageAction, null);
  const [deleteState, deleteAction] = useActionState(deleteImagesAction, null);
  const [currentPage, changePage] = useState(1);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [isSelectedMode, setSelectedMode] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<CleanImage | boolean>(false);

  const setUploadFiles = (nextFiles: File[]) => {
    const imageFiles = nextFiles.filter((file) => file.type.startsWith("image/"));
    setSelectedFiles(imageFiles);
    setPreview(imageFiles.map((file) => URL.createObjectURL(file)));

    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      imageFiles.forEach((file) => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const onSelect = (id: number) => {
    if (isSelectedMode) {
      if (selectedImages.includes(id)) {
        setSelectedImages(selectedImages.filter((i) => i !== id));
      } else setSelectedImages((prevState) => [...prevState, id]);
    } else setImageToEdit(images.find((image) => image.id === id) || false);
  };

  const onDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    const nextFiles = Array.from(e.dataTransfer.files);
    if (nextFiles.length) {
      setUploadFiles(nextFiles);
    }
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploadFiles(Array.from(e.target.files));
  };

  const resetUpload = () => {
    setPreview([]);
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const deleteImages = async () => {
    startTransition(() => {
      deleteAction(selectedImages);
    });
  };

  useEffect(() => {
    async function getImages() {
      const response = await getImagesAPI();
      setImages(response);
    }
    getImages();
  }, [deleteState, state]);

  useEffect(() => {
    if (state?.success) resetUpload();
  }, [state]);

  useEffect(() => {
    return () => {
      preview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [preview]);

  const totalPages = Math.max(1, Math.ceil(images.length / MEDIA_PER_PAGE));
  const paginatedImages = images.slice(
    (currentPage - 1) * MEDIA_PER_PAGE,
    currentPage * MEDIA_PER_PAGE,
  );

  return (
    <div className="p-10">
      <DashboardDescription
        h1="Curated Visual Assets"
        p="Upload high-quality images to make your service stand out in the catalog. The first image will be set as the primary cover. You can drag and drop your files here or browse your local storage."
        upperH1="Media Management"
        highlight="Visual"
      >
        <div className="mt-5 flex min-h-[220px] w-full gap-5">
          <form
            action={formAction}
            className="flex w-full gap-3 rounded-lg border-2 bg-white p-3 text-base"
          >
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className={cn(
                "flex w-[40%] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white transition-colors hover:bg-gray-100",
                preview.length > 0 && "hidden",
              )}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span>
                </p>
                <p className="text-center text-xs text-gray-400">PNG, JPG or GIF (MAX. 2MB)</p>
              </div>
              <input
                ref={fileInputRef}
                onChange={onChangeInput}
                id="dropzone-file"
                type="file"
                name="file"
                multiple
                className="hidden"
                accept="image/*"
              />
            </label>
            {preview.length > 0 && (
              <div className="grid max-h-[220px] w-[40%] grid-cols-3 gap-2 overflow-y-auto">
                {preview.map((src, index) => (
                  <div
                    key={`${src}-${index}`}
                    className="relative aspect-square overflow-hidden rounded-lg bg-slate-100"
                  >
                    <Image
                      src={src}
                      alt={`Preview ${index + 1}`}
                      fill={true}
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ))}
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
              {selectedFiles.length > 0 && (
                <p className="text-sm text-slate-500">
                  {selectedFiles.length} {selectedFiles.length === 1 ? "image" : "images"} selected
                </p>
              )}
              <div className="flex gap-1">
                <Button
                  type="submit"
                  className="flex-1 text-base"
                  size="normal"
                  disabled={isPending || selectedFiles.length === 0}
                >
                  {isPending ? "Uploading..." : "Upload"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="flex-1 text-base"
                  onClick={resetUpload}
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
        {paginatedImages.length > 0 ? (
          <div className="grid w-full grid-cols-5 gap-3">
            {paginatedImages.map((image: CleanImage) => (
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
        <div className="flex items-center justify-between border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="normal"
              disabled={currentPage <= 1}
              onClick={() => changePage(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              size="normal"
              disabled={currentPage >= totalPages}
              onClick={() => changePage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
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
