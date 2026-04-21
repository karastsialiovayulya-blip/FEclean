"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getSlotsAPI } from "@/lib/api/actions/order";
import { CartLine, cartStore } from "@/lib/store/cartStore";
import { userStore } from "@/lib/store/userStore";
import { CleanerAvailabilitySlot, Customer, Order, OrderStatus } from "@/lib/types/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface CartItemDto {
  serviceId: number;
  quantity: number;
}

interface OrderCheckRequest {
  items: CartItemDto[];
  requestedCleanerCount: number;
  appointmentDate: string;
  address: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const cartState = cartStore();
  const userState = userStore();
  const [slots, setSlots] = useState<CleanerAvailabilitySlot[]>([]);
  const [availableSlots, setAvailableSlots] = useState<CleanerAvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<CleanerAvailabilitySlot | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    specialInstructions: "",
  });

  const getSlotsForDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setAvailableSlots([]);
      setSelectedSlot(null);
      return [];
    }

    const selectedDay = selectedDate.toISOString().slice(0, 10);
    const matchingSlots = slots.filter((slot) => slot.start.slice(0, 10) === selectedDay);
    setAvailableSlots(matchingSlots);
    setSelectedSlot(null);
    console.log("Available slots for selected date:", matchingSlots);
    return matchingSlots;
  };

  const handleDateSelect = (selected: Date | undefined) => {
    setDate(selected);
    return getSlotsForDate(selected);
  };

  const handleSlotSelect = (slot: CleanerAvailabilitySlot) => {
    setSelectedSlot(slot);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookOrder = () => {
    // Validate all required fields
    if (!date || !selectedSlot) {
      alert("Please select a date and time slot");
      return;
    }

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (cartState.cartLines.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // Create customer object
    const customer: Customer = {
      id: userState.user?.id || 0,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      username: userState.user?.username || "",
      phone: formData.phone,
      roles: userState.user?.roles || [],
      address: formData.address,
    };

    // Calculate total price and time
    const totalPrice =
      cartState.cartLines.reduce((sum, line) => sum + line.service.price * line.quantity, 0) +
      selectedSlot.totalPrice;
    const totalTime = cartState.cartLines.reduce(
      (sum, line) => sum + line.service.time * line.quantity,
      0,
    );

    // Create order object
    const order: Order = {
      id: 0, // Will be assigned by backend
      customer,
      status: OrderStatus.PENDING,
      totalPrice,
      totalTime,
      appointmentDate: selectedSlot.start,
      items: cartState.cartLines,
      cleaners: [],
      requestedCleanerCount: 1,
      address: formData.address,
    };

    console.log("Order created:", order);
    // TODO: Send order to backend/API
  };

  const getProgressWidth = () => {
    switch (currentStep) {
      case 1:
        return "w-1/3";
      case 2:
        return "w-2/3";
      case 3:
        return "w-full";
      default:
        return "w-1/3";
    }
  };

  // Update progress bar based on user progress
  useEffect(() => {
    if (date) {
      setCurrentStep(2);
    }
  }, [date]);

  useEffect(() => {
    if (selectedSlot) {
      setCurrentStep(3);
    }
  }, [selectedSlot]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Populate form with user data if logged in
  useEffect(() => {
    if (userState.isAuthenticated && userState.user) {
      setFormData({
        firstName: userState.user.firstName || "",
        lastName: userState.user.lastName || "",
        email: userState.user.email || "",
        phone: userState.user.phone || "",
        address: "address" in userState.user ? userState.user.address || "" : "",
        specialInstructions: "",
      });
    }
  }, [userState.isAuthenticated, userState.user]);

  useEffect(() => {
    if (!mounted) return;

    if (cartState.cartLines.length === 0) {
      router.replace("/cart");
      return;
    }

    const fetchSlots = async () => {
      const items: CartItemDto[] = cartState.cartLines.map((line: CartLine) => ({
        serviceId: line.service.id,
        quantity: line.quantity,
      }));

      const currentDate = new Date().toISOString().slice(0, 19);

      const request: OrderCheckRequest = {
        items,
        requestedCleanerCount: 1,
        appointmentDate: currentDate,
        address: "lolo street 123",
      };

      const result = await getSlotsAPI(request);
      console.log("Fetched slots:", result);
      setSlots(result);
      getSlotsForDate(new Date());
    };

    fetchSlots();
  }, [cartState.cartLines, mounted, router]);

  return (
    <main>
      {!mounted && (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-lg">Loading...</p>
        </div>
      )}

      {mounted && (
        <>
          <div className="mt-20 mb-16 text-center">
            <span className="font-label text-primary mb-4 block text-xs font-bold tracking-[0.2em] uppercase">
              Reservation Portal
            </span>
            <h1 className="font-headline text-on-surface mb-8 text-4xl font-extrabold tracking-tight md:text-5xl">
              Secure Your Session
            </h1>
            <div className="bg-surface-container relative mx-auto h-1.5 w-full max-w-md overflow-hidden rounded-full">
              <div
                className={cn(
                  "bg-primary absolute top-0 left-0 h-full transition-all duration-700",
                  getProgressWidth(),
                )}
              ></div>
            </div>
            <div className="mx-auto mt-4 flex max-w-md justify-between px-1">
              <span
                className={cn(
                  "text-xs font-bold",
                  currentStep >= 1 ? "text-primary" : "text-outline",
                )}
              >
                Service
              </span>
              <span
                className={cn(
                  "text-xs font-medium",
                  currentStep >= 2 ? "text-primary" : "text-outline",
                )}
              >
                Schedule
              </span>
              <span
                className={cn(
                  "text-xs font-medium",
                  currentStep >= 3 ? "text-primary" : "text-outline",
                )}
              >
                Details
              </span>
            </div>
          </div>
          <div className="space-y-10 px-[20%]">
            <div>
              <div className="flex items-center gap-3">
                <span className="bg-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white">
                  1
                </span>
                <h2 className="font-headline text-2xl font-bold tracking-tight">Your Services</h2>
              </div>
              <div className="mt-6 overflow-x-auto">
                <div className="flex gap-4 pb-4">
                  {cartState.cartLines.map((line: CartLine) => (
                    <div
                      key={line.service.id}
                      className="bg-surface-container w-80 flex-shrink-0 rounded-lg p-4"
                    >
                      <div className="relative aspect-square w-full">
                        {line.service.featuredImage ? (
                          <Image
                            src={line.service.featuredImage.url}
                            fill={true}
                            alt={line.service.featuredImage.alt}
                            className="rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center rounded-lg bg-gray-100 text-lg">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="mb-4">
                        <h3 className="font-headline text-lg font-bold">{line.service.name}</h3>
                        <p className="text-outline mt-1 text-sm">{line.service.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-outline text-xs">Quantity</p>
                          <p className="font-headline text-primary text-xl font-bold">
                            {line.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-outline text-xs">Price</p>
                          <p className="font-headline text-xl font-bold">
                            ${line.service.price * line.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="bg-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white">
                  2
                </span>
                <h2 className="font-headline text-2xl font-bold tracking-tight">
                  Pick date and time
                </h2>
              </div>
              <div className="mt-6 flex gap-6 overflow-x-auto">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  className="flex-1 rounded-lg border bg-white text-base"
                  captionLayout="dropdown"
                />

                {availableSlots.length === 0 ? (
                  <div className="text-muted-foreground flex flex-2 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
                    No available slots for this date.
                  </div>
                ) : (
                  <div className="grid flex-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot?.start === slot.start;
                      return (
                        <button
                          key={slot.start}
                          type="button"
                          onClick={() => handleSlotSelect(slot)}
                          className={cn(
                            "rounded-lg border px-4 py-3 text-left transition-colors",
                            isSelected
                              ? "border-transparent bg-emerald-500 text-white"
                              : "border-gray-200 bg-gray-100 text-slate-900 hover:bg-gray-200",
                          )}
                        >
                          <div className="text-center font-semibold">
                            {new Date(slot.start).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <div className="text-muted-foreground text-center text-sm">
                            {new Date(slot.end).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="bg-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white">
                  3
                </span>
                <h2 className="font-headline text-2xl font-bold tracking-tight">Service Details</h2>
              </div>
              <div className="mt-6 space-y-8 rounded-xl bg-white p-6 shadow-lg">
                {!userState.isAuthenticated && (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-outline text-xs font-bold tracking-wider uppercase">
                        First Name
                      </label>
                      <input
                        className="bg-background focus:ring-primary/40 text-on-surface w-full rounded-lg border-none p-4 transition-all focus:bg-white focus:ring-1"
                        placeholder="Julian"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-outline text-xs font-bold tracking-wider uppercase">
                        Last Name
                      </label>
                      <input
                        className="bg-background focus:ring-primary/40 text-on-surface w-full rounded-lg border-none p-4 transition-all focus:bg-white focus:ring-1"
                        placeholder="Thorne"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-outline text-xs font-bold tracking-wider uppercase">
                        Email Address
                      </label>
                      <input
                        className="bg-background focus:ring-primary/40 text-on-surface w-full rounded-lg border-none p-4 transition-all focus:bg-white focus:ring-1"
                        placeholder="j.thorne@example.com"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-outline text-xs font-bold tracking-wider uppercase">
                        Phone Number
                      </label>
                      <input
                        className="bg-background focus:ring-primary/40 text-on-surface w-full rounded-lg border-none p-4 transition-all focus:bg-white focus:ring-1"
                        placeholder="+1 (555) 123-4567"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-outline text-xs font-bold tracking-wider uppercase">
                    Service Address
                  </label>
                  <input
                    className="bg-background focus:ring-primary/40 text-on-surface w-full rounded-lg border-none p-4 transition-all focus:bg-white focus:ring-1"
                    placeholder="123 Serenity Lane, Suite 400"
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-outline text-xs font-bold tracking-wider uppercase">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    className="bg-background focus:ring-primary/40 text-on-surface w-full rounded-lg border-none p-4 transition-all focus:bg-white focus:ring-1"
                    placeholder="Key is under the botanical planter..."
                    value={formData.specialInstructions}
                    onChange={(e) => updateFormData("specialInstructions", e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="mt-15 mb-20 flex justify-center">
              <Button
                size="normal"
                className="w-48 px-5 py-4 text-lg"
                onClick={handleBookOrder}
              >
                Book order
              </Button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
