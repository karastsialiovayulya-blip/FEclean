"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Service } from "@/lib/types/types";
import MultipleDelete from "@/components/multipleDelete";
import CreateService from "@/components/popups/createService";
import { Button } from "@/components/ui/button";
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
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [isSelectedMode, setSelectedMode] = useState(false);

  const deleteServices = async () => {
    const responce = await fetch("http://localhost:8080/services", {
      method: "DELETE",
      body: JSON.stringify(selectedServices),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (responce.ok) {
      console.log("services deleted");
    }
  };

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
      <MultipleDelete
        isSelectedMode={isSelectedMode}
        setSelectedMode={setSelectedMode}
        setSelected={setSelectedServices}
        deleteSelected={deleteServices}
      />
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
              <TableRow
                key={service.id}
                onClick={() => {
                  setIsPopupOpen(true);
                  setServiceToEdit(service);
                }}
              >
                <TableCell className="flex items-center gap-2 font-semibold">
                  {service.featuredImage && (
                    <div className="relative size-[5vh] flex-shrink-0">
                      <Image
                        src={service.featuredImage.url}
                        fill={true}
                        alt={service.featuredImage.alt}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
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
      {isPopupOpen && (
        <CreateService
          setIsPopupOpen={setIsPopupOpen}
          service={serviceToEdit}
        />
      )}
    </div>
  );
}
