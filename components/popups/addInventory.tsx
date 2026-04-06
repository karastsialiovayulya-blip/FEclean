"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Inventory, Service } from "@/lib/types/types";
import { cn } from "@/lib/utils";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import BasePopup from "./basePopup";

interface NewServiceReq {
  id?: number;
  service: Service;
  inventory: Inventory;
  requiredAmount: number;
}

interface ServiceReqPayload {
  service: { id: number };
  inventory: { id: number };
  requiredAmount: number;
}

export default function AddInventoryPopupToService({
  service,
  setIsPopupOpen,
}: {
  service: Service;
  setIsPopupOpen: (open: boolean) => void;
}) {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [serviceReqs, setServiceReqs] = useState<NewServiceReq[]>([]);

  const handleAmountChange = (inventoryId: number, amount: number) => {
    setServiceReqs((prev) =>
      prev.map((req) =>
        req.inventory.id === inventoryId ? { ...req, requiredAmount: amount } : req,
      ),
    );
  };

  const deleteReq = async (inventoryId: number, serviceReqId: number | undefined) => {
    if (!serviceReqId)
      setServiceReqs((prev) => prev.filter((req) => req.inventory.id !== inventoryId));
    else {
      try {
        const responce = await fetch(
          "http://localhost:8080/services/requirements/" + serviceReqId,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (responce.ok) {
          setServiceReqs((prev) => prev.filter((req) => req.inventory.id !== inventoryId));
        }
      } catch (error) {
        return { success: false, error: "Something went wrong" };
      }
    }
  };

  const addReqs = async () => {
    const payload: ServiceReqPayload[] = serviceReqs.map((req) => ({
      id: req.id,
      service: { id: req.service.id },
      inventory: { id: req.inventory.id },
      requiredAmount: req.requiredAmount,
    }));

    try {
      const responce = await fetch("http://localhost:8080/services/requirements", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (responce.ok) {
        setIsPopupOpen(false);
      }
    } catch (error) {
      return { success: false, error: "Something went wrong" };
    }
  };

  useEffect(() => {
    async function getInventories() {
      const responce = await fetch("http://localhost:8080/inventory", {
        method: "GET",
      });
      if (responce.ok) {
        const data = await responce.json();
        setInventories(data);
        console.log(data);
      }
    }
    getInventories();
    const existedReq: NewServiceReq[] = service.requirments.map((requirement) => ({
      id: requirement.id,
      service: service,
      inventory: requirement.inventory!,
      requiredAmount: requirement.requiredAmount,
    }));
    setServiceReqs(existedReq);
  }, []);

  return (
    <BasePopup
      setIsPopupOpen={setIsPopupOpen}
      width="w-[30vw]"
    >
      <div className="flex flex-col gap-5">
        <Combobox
          items={inventories.filter(
            (inventory) => !serviceReqs.some((req) => req.inventory.id === inventory.id),
          )}
        >
          <ComboboxInput
            placeholder="Select inventory"
            className="py-2"
          />
          <ComboboxContent>
            <ComboboxEmpty className="text-base">No items found.</ComboboxEmpty>
            <ComboboxList>
              {(inventory: Inventory) => (
                <ComboboxItem
                  className="py-2 text-base"
                  key={inventory.id}
                  value={inventory.id}
                  onClick={() => {
                    const newReq: NewServiceReq = {
                      service: service,
                      inventory: inventory,
                      requiredAmount: 0,
                    };
                    setServiceReqs((prev) => [...prev, newReq]);
                  }}
                >
                  {inventory.name}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <div className="flex flex-col gap-3">
          {serviceReqs.map((serviceReq) => (
            <div
              className="flex gap-3"
              key={serviceReq.inventory.id}
            >
              <div className="relative flex size-[15vh]">
                {serviceReq.inventory.featuredImage ? (
                  <Image
                    src={serviceReq.inventory.featuredImage.url}
                    fill={true}
                    alt={serviceReq.inventory.featuredImage.alt}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex w-full items-center justify-center rounded-lg bg-gray-100">
                    No image ;(
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold">{serviceReq.inventory.name}</h3>
                  <p className="text-sm">{serviceReq.inventory.description}</p>
                </div>
                <div>
                  <h3>Set required amount</h3>
                  <Input
                    value={serviceReq.requiredAmount}
                    onChange={(e) =>
                      handleAmountChange(serviceReq.inventory.id, Number(e.target.value))
                    }
                    id="input-demo-api-key"
                    type="text"
                    placeholder="price"
                    name="price"
                    className="text-base"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <Button
                  className="block"
                  variant="destructive"
                  onClick={() => deleteReq(serviceReq.inventory.id, serviceReq.id)}
                >
                  <HugeiconsIcon icon={Delete02Icon} />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          size="normal"
          onClick={addReqs}
        >
          Add
        </Button>
      </div>
    </BasePopup>
  );
}
