"use client";

import * as React from "react";
import Image from "next/image";
import { CleanImage, Service } from "@/lib/types/types";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export default function ImagesCarousel({ service }: { service: Service }) {
  const plugin = React.useRef(
    Autoplay({ delay: 1500, stopOnInteraction: false, playOnInit: false }),
  );

  return (
    <Carousel
      className="w-full"
      onMouseEnter={() => plugin.current.play()}
      onMouseLeave={() => plugin.current.stop()}
      plugins={[plugin.current]}
    >
      <CarouselContent>
        <CarouselItem>
          <div className="relative aspect-3/2 w-full">
            <Image
              src={service.featuredImage.url}
              alt={service.featuredImage.alt}
              fill={true}
            />{" "}
          </div>
        </CarouselItem>
        {service.images.map((image: CleanImage, index) => (
          <CarouselItem
            key={image.id}
            className=" "
          >
            <div className="relative aspect-3/2 w-full">
              {index}
              <Image
                src={image.url}
                alt={image.alt}
                fill={true}
                key={image.id}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
