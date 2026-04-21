import { useEffect, useState } from "react";
import {
  claimOrderAPI,
  getCleanerOrdersAPI,
  getUnassignedOrdersAPI,
} from "@/lib/api/actions/order";
import { Cleaner, Order, OrderStatus } from "@/lib/types/types";
import { cn } from "@/lib/utils";
import OrderCard from "@/components/orderCard";

type CleanerTab = "appointments" | "unassigned";

export default function CleanerPage({ user }: { user: Cleaner }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<CleanerTab>("appointments");
  const [unassignedOrders, setUnassignedOrders] = useState<Order[]>([]);

  const upcomingOrders = orders.filter(
    (order) => order.status === OrderStatus.PENDING || order.status === OrderStatus.CONFIRMED,
  );

  const orderHistory = orders.filter(
    (order) => order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELLED,
  );

  useEffect(() => {
    async function fetchOrders() {
      const response = await getCleanerOrdersAPI(user.id);
      if (response.ok) {
        setOrders(response.data);
      } else {
        console.error("Failed to fetch cleaner orders:", response.error);
      }
    }

    fetchOrders();
  }, [user.id]);

  useEffect(() => {
    async function fetchOrders() {
      const response = await getUnassignedOrdersAPI(user.id);
      if (response.ok) {
        setUnassignedOrders(response.data);
      } else {
        console.error("Failed to fetch unassigned orders:", response.error);
      }
    }

    fetchOrders();
  }, [user.id]);

  const handleClaimOrder = (orderToClaim: Order) => {
    setUnassignedOrders((currentOrders) =>
      currentOrders.filter((currentOrder) => currentOrder.id !== orderToClaim.id),
    );
    setOrders((currentOrders) => [
      {
        ...orderToClaim,
        cleaners: [...orderToClaim.cleaners, user],
        status: OrderStatus.CONFIRMED,
      },
      ...currentOrders,
    ]);
  };

  const onClaimOrder = async (orderId: number) => {
    const response = await claimOrderAPI(orderId, { cleanerId: user.id });
    if (response.ok) {
      const claimedOrder = unassignedOrders.find((order) => order.id === orderId);
      if (claimedOrder) {
        handleClaimOrder(claimedOrder);
      }
    } else {
      console.error("Failed to claim order:", response.error);
    }
  };

  const handleOrderStatusChange = (orderId: number, status: OrderStatus) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) => (order.id === orderId ? { ...order, status } : order)),
    );
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex gap-3">
        <button
          type="button"
          className={cn(
            "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
            activeTab === "appointments"
              ? "bg-primary text-white"
              : "bg-white text-slate-600 hover:bg-slate-100",
          )}
          onClick={() => setActiveTab("appointments")}
        >
          My Appointments
        </button>
        <button
          type="button"
          className={cn(
            "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
            activeTab === "unassigned"
              ? "bg-primary text-white"
              : "bg-white text-slate-600 hover:bg-slate-100",
          )}
          onClick={() => setActiveTab("unassigned")}
        >
          Unassigned Orders
        </button>
      </div>

      {activeTab === "appointments" ? (
        <div>
          <div>
            <h2 className="text-2xl font-bold">Upcoming Appointments</h2>
            <div className="my-6">
              <div className="space-y-4 rounded-xl bg-white p-8">
                {upcomingOrders.length > 0 ? (
                  upcomingOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      editable={true}
                      onStatusChange={(status) => handleOrderStatusChange(order.id, status)}
                    />
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-500">
                    No upcoming appointments yet.
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Order history</h2>
            <div className="mt-6">
              <div className="space-y-4 rounded-xl bg-white p-8">
                {orderHistory.length > 0 ? (
                  orderHistory.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      editable={true}
                      onStatusChange={(status) => handleOrderStatusChange(order.id, status)}
                    />
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-500">
                    No past orders yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-white p-8">
          <h2 className="text-2xl font-bold">Unassigned Orders</h2>
          <div className="mt-6 space-y-4">
            {unassignedOrders.length > 0 ? (
              unassignedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  claimable={true}
                  onClaim={onClaimOrder}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-500">
                No unassigned orders available right now.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
