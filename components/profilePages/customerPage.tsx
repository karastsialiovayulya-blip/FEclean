import { useEffect, useState } from "react";
import { getOrdersAPI } from "@/lib/api/actions/order";
import { Customer, Order, OrderStatus } from "@/lib/types/types";
import OrderCard from "@/components/orderCard";

export default function CustomerPage({ user }: { user: Customer }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const upcomingOrders = orders.filter(
    (order) => order.status === OrderStatus.PENDING || order.status === OrderStatus.CONFIRMED,
  );

  const orderHistory = orders.filter(
    (order) => order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELLED,
  );

  useEffect(() => {
    async function fetchOrders() {
      const response = await getOrdersAPI(user.id);
      if (response.ok) {
        setOrders(response.data);
      } else {
        console.error("Failed to fetch orders:", response.error);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="w-full">
      <div>
        <h2 className="text-2xl font-bold">Upcoming Appointments</h2>
        <div className="my-6">
          <div className="space-y-4 rounded-xl bg-white p-8">
            {upcomingOrders.length > 0 ? (
              upcomingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
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
  );
}
