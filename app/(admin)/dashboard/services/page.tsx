"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Service } from "@/lib/types/types";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import CreateService from "@/components/popups/createService";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    async function getService() {
      const responce = await fetch("http://localhost:8080/services", {
        method: "GET",
      });
      if (responce.ok) {
        const data = await responce.json();
        setServices(data);
        console.log(data);
      }
    }
    getService();
  }, [isPopupOpen]);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-semibold">Services</h1>
      <p className="mt-1 w-[60%]">
        Take full control of your cleaning business. Monitor team performance in real-time, automate
        recurring appointments, and keep your service quality consistent — all through one
        integrated platform.
      </p>
      <div className="mt-2 flex items-end justify-between py-2">
        <div className="flex items-center gap-1">
          <Switch />
          <p>Selecting mode</p>
        </div>
        <Button
          variant="destructive"
          size="normal"
          className="flex items-center gap-1"
        >
          <HugeiconsIcon icon={Delete02Icon} />
          Delete
        </Button>
      </div>
      <div className="flex h-[75vh] w-full flex-col justify-between rounded-lg border-3 bg-white p-4">
        <Table className="w-full table-fixed text-base">
          <TableCaption>A list of your recent services.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5">Service</TableHead>
              <TableHead className="w-auto">Description</TableHead>
              <TableHead className="w-[100px]">Time</TableHead>
              <TableHead className="w-[100px] text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="flex items-center gap-2 font-semibold">
                  <div className="relative size-[5vh] flex-shrink-0">
                    <Image
                      src={service.featuredImage.url}
                      fill={true}
                      alt={service.featuredImage.alt}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  {service.name}
                </TableCell>
                <TableCell className="whitespace-normal">{service.description}</TableCell>
                <TableCell>{service.time} min</TableCell>
                <TableCell className="text-right">${service.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div>
          <Button
            size="normal"
            onClick={() => setIsPopupOpen(true)}
          >
            Add
          </Button>
        </div>
      </div>
      {isPopupOpen && <CreateService setIsPopupOpen={setIsPopupOpen} />}
    </div>
  );
}
