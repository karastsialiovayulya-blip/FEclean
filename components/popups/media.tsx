import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getImagesAPI, uploadImageAction } from "@/lib/api/actions/image";
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadState, uploadAction, isUploading] = useActionState(uploadImageAction, null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const setUploadFiles = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    setSelectedFiles(imageFiles);
    setPreviewUrls(imageFiles.map((file) => URL.createObjectURL(file)));

    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      imageFiles.forEach((file) => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const onSelect = (id: number) => {
    if (selectedImages.includes(id)) {
      setSelectecImages(selectedImages.filter((i) => i !== id));
    } else {
      if (isMultiple) setSelectecImages((prevState) => [...prevState, id]);
      else setSelectecImages([id]);
    }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploadFiles(Array.from(e.target.files));
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const nextFiles = Array.from(e.dataTransfer.files);
    if (nextFiles.length > 0) setUploadFiles(nextFiles);
  };

  const clearUploadSelection = () => {
    setSelectedFiles([]);
    setPreviewUrls([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    async function getImages() {
      const response = await getImagesAPI();
      setImages(response);
    }
    getImages();
  }, []);

  useEffect(() => {
    if (uploadState?.success) {
      clearUploadSelection();
      async function refresh() {
        const response = await getImagesAPI();
        setImages(response);
      }
      refresh();
    }
  }, [uploadState]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <BasePopup
      setIsPopupOpen={setIsPopupOpen}
      width="w-[90%] max-w-[1200px]"
    >
      <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <form
          action={uploadAction}
          method="post"
          encType="multipart/form-data"
          className="grid gap-4"
        >
          <label
            htmlFor="media-upload"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500 transition hover:border-slate-400 hover:bg-slate-50"
          >
            <span className="font-semibold">Upload new images</span>
            <span className="mt-2 text-xs text-slate-400">Drop files here or click to browse</span>
            <input
              ref={fileInputRef}
              id="media-upload"
              type="file"
              name="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {previewUrls.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {previewUrls.map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className="relative aspect-square overflow-hidden rounded-lg bg-slate-100"
                >
                  <Image
                    src={src}
                    alt={`Preview ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="submit"
              size="normal"
              disabled={isUploading || selectedFiles.length === 0}
            >
              {isUploading ? "Uploading..." : "Upload files"}
            </Button>
            <Button
              variant="outline"
              type="button"
              size="normal"
              onClick={clearUploadSelection}
              disabled={isUploading}
            >
              Clear
            </Button>
            {uploadState?.error && <p className="text-sm text-red-500">{uploadState.error}</p>}
            {uploadState?.success && (
              <p className="text-sm text-emerald-600">
                {uploadState.message || "Uploaded successfully"}
              </p>
            )}
          </div>
        </form>
      </div>
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
