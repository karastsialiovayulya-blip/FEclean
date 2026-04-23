"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createOrderAPI, getSlotsAPI } from "@/lib/api/actions/order";
import { CartLine, cartStore } from "@/lib/store/cartStore";
import { userStore } from "@/lib/store/userStore";
import { CleanerAvailabilitySlot } from "@/lib/types/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface CartItemDto {
  serviceId: number;
  quantity: number;
  area: number | null;
}

interface OrderCheckRequest {
  items: CartItemDto[];
  requestedCleanerCount: number;
  appointmentDate: string;
  address: string;
}

interface CreateOrderRequest extends OrderCheckRequest {
  customerId?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

const toCartItemDto = (line: CartLine): CartItemDto => ({
  serviceId: line.service.id,
  quantity: line.quantity ?? 1,
  area: line.area ?? null,
});

export default function CheckoutPage() {
  const router = useRouter();
  const cartState = cartStore();
  const userState = userStore();
  const [slots, setSlots] = useState<CleanerAvailabilitySlot[]>([]);
  const [availableSlots, setAvailableSlots] = useState<CleanerAvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<CleanerAvailabilitySlot | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [mounted, setMounted] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatLocalDateKey = (value: Date) => {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatLocalDateTime = (value: Date) => {
    const datePart = formatLocalDateKey(value);
    const hours = String(value.getHours()).padStart(2, "0");
    const minutes = String(value.getMinutes()).padStart(2, "0");
    const seconds = String(value.getSeconds()).padStart(2, "0");
    return `${datePart}T${hours}:${minutes}:${seconds}`;
  };

  const normalizeSlotDateTime = (value: string) => {
    const [datePart = "", timePart = "00:00:00"] = value.split("T");
    const cleanTime = timePart.replace(/Z$/, "").split(/[+-]/)[0] || "00:00:00";
    return `${datePart}T${cleanTime.slice(0, 8)}`;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

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

    const selectedDay = formatLocalDateKey(selectedDate);
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
    setOrderError("");
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setOrderError("");
  };

  const handleBookOrder = async () => {
    // Validate all required fields
    if (!date || !selectedSlot) {
      setOrderError("Please select a date and time slot.");
      return;
    }

    if (!formData.address) {
      setOrderError("Please fill in all required fields.");
      return;
    }

    if (
      !userState.isAuthenticated &&
      (!formData.firstName || !formData.lastName || !formData.email || !formData.phone)
    ) {
      setOrderError("Please fill in all required fields.");
      return;
    }

    if (cartState.cartLines.length === 0) {
      setOrderError("Your cart is empty.");
      return;
    }

    setOrderError("");
    setIsSubmitting(true);

    const items: CartItemDto[] = cartState.cartLines.map(toCartItemDto);

    const orderRequest: CreateOrderRequest = {
      items,
      requestedCleanerCount: cartState.requestedCleanerCount,
      appointmentDate: normalizeSlotDateTime(selectedSlot.start),
      address: formData.address,
    };

    if (userState.isAuthenticated && userState.user?.id) {
      orderRequest.customerId = userState.user.id;
    } else {
      orderRequest.firstName = formData.firstName;
      orderRequest.lastName = formData.lastName;
      orderRequest.email = formData.email;
      orderRequest.phone = formData.phone;
    }

    console.log("Order request:", orderRequest);
    const response = await createOrderAPI(orderRequest);
    console.log("Order response:", response);

    if (response.ok) {
      router.push("/checkout/success");
      cartState.clearCart();
      return;
    }

    setOrderError(response.error || "Failed to create order.");
    setIsSubmitting(false);
  };

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

    console.log(cartState.cartLines.length);

    const fetchSlots = async () => {
      const items: CartItemDto[] = cartState.cartLines.map(toCartItemDto);

      const currentDate = formatLocalDateTime(new Date());

      const request: OrderCheckRequest = {
        items,
        requestedCleanerCount: cartState.requestedCleanerCount,
        appointmentDate: currentDate,
        address: "lolo street 123",
      };

      console.log("Fetching slots with request:", request);

      const result = await getSlotsAPI(request);
      console.log("Fetched slots:", result);
      setSlots(result);
      getSlotsForDate(new Date());
    };

    fetchSlots();
  }, [cartState.cartLines, cartState.requestedCleanerCount, mounted, router]);

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
                  "bg-primary absolute top-0 left-0 h-full w-full transition-all duration-700",
                )}
              ></div>
            </div>
            <div className="mx-auto mt-4 flex max-w-md justify-between px-1">
              <span className="text-primary text-xs font-bold">Service</span>
              <span className="text-primary text-xs font-bold">Schedule</span>
              <span className="text-primary text-xs font-bold">Details</span>
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
                      key={line.id}
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
                          <p className="text-outline text-xs">
                            {line.quantity !== undefined ? "Quantity" : "Area"}
                          </p>
                          <p className="font-headline text-primary text-xl font-bold">
                            {line.quantity ?? line.area}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-outline text-xs">Price</p>
                          <p className="font-headline text-xl font-bold">
                            ${line.service.price * (line.quantity ?? 1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>Total price: ${cartState.getPrice().toFixed(2)}</div>
              <div>Total time: {cartState.getEstimatedTime()}</div>
              <div>Requested cleaners: {cartState.requestedCleanerCount}</div>
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
              <div className="flex w-full max-w-md flex-col items-center gap-3">
                <Button
                  size="normal"
                  className="w-48 px-5 py-4 text-lg"
                  onClick={handleBookOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Booking..." : "Book order"}
                </Button>
                {orderError && <p className="text-center text-sm text-red-600">{orderError}</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
