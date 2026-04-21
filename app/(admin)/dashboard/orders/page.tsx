"use client";

import { useEffect, useMemo, useState } from "react";
import { getOrdersAPI } from "@/lib/api/actions/order";
import { Order, OrderStatus } from "@/lib/types/types";
import { cn } from "@/lib/utils";
import OrderCard from "@/components/orderCard";
import { DashboardDescription } from "@/components/sections/heroSections";
import { Button } from "@/components/ui/button";

const ORDERS_PER_PAGE = 5;

const STATUS_TABS = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.COMPLETED,
  OrderStatus.CANCELLED,
] as const;

type StatusTab = (typeof STATUS_TABS)[number];
type PaginationState = Record<StatusTab, number>;

const INITIAL_PAGES: PaginationState = {
  [OrderStatus.PENDING]: 1,
  [OrderStatus.CONFIRMED]: 1,
  [OrderStatus.COMPLETED]: 1,
  [OrderStatus.CANCELLED]: 1,
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<StatusTab>(OrderStatus.PENDING);
  const [pagesByStatus, setPagesByStatus] = useState<PaginationState>(INITIAL_PAGES);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true);
      const response = await getOrdersAPI();
      if (response.ok) {
        setOrders(response.data);
      } else {
        console.error("Failed to fetch orders:", response.error);
      }
      setIsLoading(false);
    }

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const appointmentDate = new Date(order.appointmentDate);

      if (dateFrom) {
        const from = new Date(`${dateFrom}T00:00:00`);
        if (appointmentDate < from) {
          return false;
        }
      }

      if (dateTo) {
        const to = new Date(`${dateTo}T23:59:59`);
        if (appointmentDate > to) {
          return false;
        }
      }

      return true;
    });
  }, [dateFrom, dateTo, orders]);

  const ordersByStatus = useMemo(() => {
    return {
      [OrderStatus.PENDING]: filteredOrders.filter((order) => order.status === OrderStatus.PENDING),
      [OrderStatus.CONFIRMED]: filteredOrders.filter(
        (order) => order.status === OrderStatus.CONFIRMED,
      ),
      [OrderStatus.COMPLETED]: filteredOrders.filter(
        (order) => order.status === OrderStatus.COMPLETED,
      ),
      [OrderStatus.CANCELLED]: filteredOrders.filter(
        (order) => order.status === OrderStatus.CANCELLED,
      ),
    };
  }, [filteredOrders]);

  const activeOrders = ordersByStatus[activeTab];
  const totalPages = Math.max(1, Math.ceil(activeOrders.length / ORDERS_PER_PAGE));
  const currentPage = Math.min(pagesByStatus[activeTab], totalPages);
  const paginatedOrders = activeOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE,
  );

  useEffect(() => {
    setPagesByStatus((currentPages) => ({
      ...currentPages,
      [activeTab]: Math.min(currentPages[activeTab], totalPages),
    }));
  }, [activeTab, totalPages]);

  const changePage = (status: StatusTab, nextPage: number) => {
    setPagesByStatus((currentPages) => ({
      ...currentPages,
      [status]: nextPage,
    }));
  };

  const handleOrderStatusChange = (orderId: number, status: OrderStatus) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) => (order.id === orderId ? { ...order, status } : order)),
    );
  };

  const resetDateFilters = () => {
    setDateFrom("");
    setDateTo("");
    setPagesByStatus(INITIAL_PAGES);
  };

  return (
    <div className="p-10">
      <DashboardDescription
        h1="Orders & Bookings"
        p="Streamline your botanical cleaning appointments with our intuitive order management system. Track, update, and optimize your service bookings effortlessly."
        upperH1="Operational Overview"
        highlight="Bookings"
      />

      <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:justify-between">
          <div className="flex flex-col justify-between">
            <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Status
            </label>
            <div className="flex flex-wrap gap-3">
              {STATUS_TABS.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={cn(
                    "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                    activeTab === status
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                  )}
                  onClick={() => setActiveTab(status)}
                >
                  {status} ({ordersByStatus[status].length})
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:flex xl:items-end">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPagesByStatus(INITIAL_PAGES);
                }}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPagesByStatus(INITIAL_PAGES);
                }}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
              />
            </div>
            <Button
              variant="secondary"
              size="normal"
              className="xl:mb-[1px]"
              onClick={resetDateFilters}
            >
              Reset period
            </Button>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {isLoading ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-500">
              Loading orders...
            </div>
          ) : paginatedOrders.length > 0 ? (
            paginatedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                editable={true}
                onStatusChange={(status) => handleOrderStatusChange(order.id, status)}
              />
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-500">
              No orders found for this status and time period.
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="normal"
              disabled={currentPage <= 1}
              onClick={() => changePage(activeTab, currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              size="normal"
              disabled={currentPage >= totalPages}
              onClick={() => changePage(activeTab, currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
