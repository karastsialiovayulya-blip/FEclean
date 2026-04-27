import { useEffect, useState } from "react";
import { changeOrderStatusAPI } from "@/lib/api/actions/order";
import { Order, OrderStatus } from "@/lib/types/types";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface OrderCardProps {
  order: Order;
  editable?: boolean;
  onStatusChange?: (status: OrderStatus) => void;
  claimable?: boolean;
  onClaim?: (orderId: number) => void;
}

const ORDER_STATUS_OPTIONS = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.COMPLETED,
  OrderStatus.CANCELLED,
];

const STATUS_PILL_STYLES: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "bg-amber-100 text-amber-800",
  [OrderStatus.CONFIRMED]: "bg-amber-100 text-amber-800",
  [OrderStatus.COMPLETED]: "bg-emerald-100 text-emerald-800",
  [OrderStatus.CANCELLED]: "bg-rose-100 text-rose-800",
};

export default function OrderCard({
  order,
  editable = false,
  onStatusChange,
  claimable = false,
  onClaim,
}: OrderCardProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);

  useEffect(() => {
    setSelectedStatus(order.status);
  }, [order.status]);

  const formattedDate = new Date(order.appointmentDate).toLocaleString([], {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleStatusChange = async (status: OrderStatus) => {
    const response = await changeOrderStatusAPI(order.id, status);
    if (response.ok) {
      setSelectedStatus(status);
      onStatusChange?.(status);
    } else {
      console.error("Failed to change order status:", response.error);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold">Order #{order.id}</p>
          <p className="mt-1 text-sm text-slate-500">{formattedDate}</p>
        </div>
        {editable ? (
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            className={cn(
              "rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold tracking-wide uppercase outline-none",
              STATUS_PILL_STYLES[selectedStatus],
            )}
          >
            {ORDER_STATUS_OPTIONS.map((status) => (
              <option
                key={status}
                value={status}
                className={STATUS_PILL_STYLES[status]}
              >
                {status}
              </option>
            ))}
          </select>
        ) : (
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase",
              STATUS_PILL_STYLES[selectedStatus],
            )}
          >
            {selectedStatus}
          </span>
        )}
      </div>
      <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-[repeat(6,minmax(0,1fr))_auto]">
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Customer</p>
          <p className="mt-1">
            {order.customer.firstName} {order.customer.lastName}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Address</p>
          <p className="mt-1">{order.address}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Total</p>
          <p className="mt-1">${order.totalPrice}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
            Requested Cleaners
          </p>
          <p className="mt-1">{order.requestedCleanerCount}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Assigned</p>
          <p className="mt-1">{order.cleaners.length}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Total Time</p>
          <p className="mt-1">{order.totalTime} min</p>
        </div>
        {claimable && onClaim && (
          <div className="flex md:col-start-7 md:justify-self-end">
            <Button
              type="button"
              onClick={() => onClaim(order.id)}
              className="bg-primary rounded-full px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Claim order
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
