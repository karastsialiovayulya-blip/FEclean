"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getServices } from "@/lib/api/actions/service";
import { Service } from "@/lib/types/types";
import { AnalyticsUpIcon, CleaningBucketIcon, Money01Icon } from "@hugeicons/core-free-icons";
import MultipleDelete from "@/components/multipleDelete";
import AddInventoryPopupToService from "@/components/popups/addInventory";
import CreateService from "@/components/popups/createService";
import { DashboardDescription } from "@/components/sections/heroSections";
import { Card02 } from "@/components/staticCards";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [isSelectedMode, setSelectedMode] = useState(false);
  const [isAddInventoryPopupOpen, setAddInventoryPopupOpen] = useState(false);

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
    async function getServiceApi() {
      const services = await getServices();
      setServices(services);
    }
    getServiceApi();
  }, [isPopupOpen, isAddInventoryPopupOpen]);

  return (
    <div className="p-10">
      <DashboardDescription
        h1="Refine the Lumina Experience."
        p="Manage your botanical and clinical cleaning offerings. Add new specialized
packages or adjust existing tiers to maintain our clinical standard of
excellence."
        upperH1="Service Catalog"
        highlight="Lumina "
      >
        <Button
          size="normal"
          onClick={() => {
            setIsPopupOpen(true);
            setServiceToEdit(null);
          }}
          className="w-[10vw] rounded-xl px-6 py-4 text-lg whitespace-normal"
        >
          Add new service
        </Button>
      </DashboardDescription>
      <div className="grid grid-cols-3 gap-7 py-10">
        <Card02
          upper="Total Services"
          title="24 Active"
          icon={CleaningBucketIcon}
        />
        <Card02
          upper="Avg. Price Point"
          title="$185.00"
          icon={Money01Icon}
        />
        <Card02
          upper="Most Popular"
          title="Botanical"
          icon={AnalyticsUpIcon}
        />
      </div>
      <MultipleDelete
        isSelectedMode={isSelectedMode}
        setSelectedMode={setSelectedMode}
        setSelected={setSelectedServices}
        deleteSelected={deleteServices}
      />
      <div className="bg-background2 flex w-full flex-col gap-4 rounded-lg p-4">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => {
              setIsPopupOpen(true);
              setServiceToEdit(service);
            }}
            className="flex items-center gap-5 rounded-lg bg-white p-5"
          >
            <div className="flex w-[40%] items-center gap-4 font-semibold">
              <div className="relative size-[10vh] flex-shrink-0">
                {service.featuredImage ? (
                  <Image
                    src={service.featuredImage.url}
                    fill={true}
                    alt={service.featuredImage.alt}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center rounded-lg bg-gray-100 text-sm">
                    No image ;(
                  </div>
                )}
              </div>
              <div>
                <h3>{service.name}</h3>
                <p className="font-thin text-gray-500">{service.description}</p>
              </div>
            </div>
            <div className="flex-1">
              <p className="font-thin uppercase">Price</p>
              <h3 className="text-lg font-bold">${service.price}</h3>
            </div>
            <div className="flex-1">
              <p className="font-thin uppercase">Time</p>
              <h3 className="text-lg font-bold">{service.time} min</h3>
            </div>
            <div className="flex-1">
              <p className="font-thin uppercase">Status</p>
              <h3 className="text-lg font-bold">later</h3>
            </div>
            <div
              className="w-[30%]"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="flex items-center gap-3">
                <p className="font-bold font-thin uppercase">Inventory</p>
                <Button
                  variant="secondary"
                  onClick={(e) => {
                    setAddInventoryPopupOpen(true);
                    setServiceToEdit(service);
                  }}
                >
                  +
                </Button>
              </div>
              {service.requirments.length > 0 && (
                <div className="flex w-full gap-2 overflow-x-auto">
                  {service.requirments.map((requirment) => (
                    <Tooltip key={requirment.id}>
                      <TooltipTrigger>
                        {requirment.inventory?.featuredImage ? (
                          <div className="relative flex size-[7vh] flex-shrink-0 items-center justify-center">
                            <Image
                              src={requirment.inventory.featuredImage.url}
                              fill={true}
                              alt={requirment.inventory.featuredImage.alt}
                              className="rounded object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-full max-w-36 items-center rounded bg-gray-100 px-2 text-sm">
                            {requirment.inventory?.name}
                          </div>
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">Needed quanity: {requirment.inventory?.amount}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div></div>
      </div>
      {isPopupOpen && (
        <CreateService
          setIsPopupOpen={setIsPopupOpen}
          service={serviceToEdit}
        />
      )}
      {isAddInventoryPopupOpen && serviceToEdit && (
        <AddInventoryPopupToService
          setIsPopupOpen={setAddInventoryPopupOpen}
          service={serviceToEdit}
        />
      )}
    </div>
  );
}
