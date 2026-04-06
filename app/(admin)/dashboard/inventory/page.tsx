"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Inventory } from "@/lib/types/types";
import { AnalyticsUpIcon, CleaningBucketIcon, Money01Icon } from "@hugeicons/core-free-icons";
import MultipleDelete from "@/components/multipleDelete";
import InventoryPopup from "@/components/popups/inventoryPopus";
import { DashboardDescription } from "@/components/sections/heroSections";
import { Card02 } from "@/components/staticCards";
import { Button } from "@/components/ui/button";

export default function InventoryPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [isSelectedMode, setSelectedMode] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<number[]>([]);
  const [inventoryToEdit, setInventoryToEdit] = useState<Inventory | null>(null);

  const deleteInventory = () => {};

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
  }, [isPopupOpen]);

  return (
    <div className="p-10">
      <DashboardDescription
        h1="The Curated Sanctuary Supply Management"
        p="Maintain clinical standards with precision tracking. Our botanical-
first supplies are monitored for optimal efficiency and zero
downtime."
        upperH1="Inventory & Supplies"
        highlight="Supply Management"
      >
        <Button
          size="normal"
          className="w-[10vw] rounded-xl px-6 py-4 text-lg whitespace-normal"
          onClick={() => {
            setIsPopupOpen(true);
            setInventoryToEdit(null);
          }}
        >
          Add inventory
        </Button>
      </DashboardDescription>
      <div className="grid grid-cols-3 gap-7 py-10">
        <Card02
          upper="Total SKU's"
          title="35 Active"
          icon={CleaningBucketIcon}
        />
        <Card02
          upper="Most used"
          title="Botanical"
          icon={AnalyticsUpIcon}
        />
      </div>
      <MultipleDelete
        isSelectedMode={isSelectedMode}
        setSelectedMode={setSelectedMode}
        setSelected={setSelectedInventory}
        deleteSelected={deleteInventory}
      />
      <div className="w-full rounded-lg border-2 bg-white p-4">
        <div className="flex flex-col gap-4">
          {inventories.map((inventory: Inventory) => (
            <div
              key={inventory.id}
              className="flex items-center justify-between gap-5 rounded-lg bg-white p-5"
            >
              <div className="flex w-[70%] gap-7 font-semibold">
                <div className="relative size-[15vh] flex-shrink-0">
                  {inventory.featuredImage ? (
                    <Image
                      src={inventory.featuredImage.url}
                      fill={true}
                      alt={inventory.featuredImage.alt}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center rounded-lg bg-gray-100">
                      No image ;(
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl">{inventory.name}</h3>
                    <p className="text-lg font-thin text-gray-500">{inventory.description}</p>
                  </div>
                  <div>
                    <p className="text-xs font-thin text-gray-500 uppercase">Current stock</p>
                    <h4 className="text-xl">
                      {inventory.amount} {inventory.unit}
                    </h4>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  size="normal"
                  variant="secondary"
                  onClick={() => {
                    setIsPopupOpen(true);
                    setInventoryToEdit(inventory);
                  }}
                >
                  Edit inventory
                </Button>
                <Button
                  size="normal"
                  variant="outline"
                  className="border-0"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isPopupOpen && (
        <InventoryPopup
          setIsPopupOpen={setIsPopupOpen}
          inventory={inventoryToEdit}
        />
      )}
    </div>
  );
}
