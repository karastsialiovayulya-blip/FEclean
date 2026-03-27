import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { CleanImage } from "@/lib/types/types";
import { useState, useEffect } from "react";
import Image from "next/image"
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface MediaPopupProps {
    isMultiple: boolean;
    setIsPopupOpen: (open: boolean) => void;
    setSingleImage: (image: CleanImage | null) => void;
    setSeveralImages: (image: CleanImage[]) => void;
}

export default function MediaPopup({ isMultiple, setIsPopupOpen, setSingleImage, setSeveralImages }: MediaPopupProps) {

    const [images, setImages] = useState<CleanImage[]>([]);
    const [selectedImages, setSelectecImages] = useState<number[]>([]);

    const onSelect = (id: number) => {
        if (selectedImages.includes(id)) {
            setSelectecImages(selectedImages.filter((i) => i !== id));
        } else {
            if (isMultiple) setSelectecImages(prevState => [...prevState, id]);
            else setSelectecImages([id]);
        }
        console.log(selectedImages);
    }

    const onSelectImage = () => {
        if (isMultiple) {
            const nextImages: CleanImage[] =[];
            selectedImages.forEach((id) => {
                const foundImage = images.find(image => image.id === id);
                if(foundImage) nextImages.push(foundImage);
            })
            setSeveralImages(nextImages);
        }
        else { setSingleImage(images.find(image => image.id === selectedImages[0]) || null); }
        setIsPopupOpen(false);
    }

    useEffect(() => {
        async function getImages() {
            const responce = await fetch("http://localhost:8080/uploads/images", { method: 'GET' });
            if (responce.ok) {
                const imagesData = await responce.json();
                setImages(imagesData);
            }
        }
        getImages();
    }, [])


    return (
        <div className="fixed w-full h-screen top-0 left-0 bg-gray-700/20 backdrop-blur-sm flex items-center justify-center z-15">
            <div className="relative p-5 w-[80%]">
                <div className="bg-red-500 absolute right-3 top-3 z-10 rounded-full p-1 text-white"
                    onClick={() => setIsPopupOpen(false)}
                >
                    <HugeiconsIcon icon={Cancel01Icon} />
                </div>
                <div className="bg-white p-5 rounded-lg">
                    <div className="grid grid-cols-4 w-full gap-3">
                        {images.map((image: CleanImage) => (
                            <div key={image.id}
                                className={cn("hover:scale-105 transition-all bg-white p-3 rounded-lg",
                                    selectedImages.includes(image.id) && "bg-secondary")}
                                onClick={() => onSelect(image.id)}>
                                <div className="relative w-full aspect-square">
                                    <Image src={image.url} fill={true} alt={image.alt} className="object-cover rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button 
                    onClick={onSelectImage}
                    size="normal" className="mt-4 mx-[auto]">Select</Button>
                </div>
            </div>
        </div>
    )
}