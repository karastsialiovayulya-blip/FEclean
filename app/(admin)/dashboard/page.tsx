"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getRecentOrdersAPI, getTotalsAPI } from "@/lib/api/actions/analytics";
import { getImagesAPI } from "@/lib/api/actions/image";
import { getInventories } from "@/lib/api/actions/inventory";
import { getOrdersAPI } from "@/lib/api/actions/order";
import { Inventory, Order, OrderStatus, TotalStatistics } from "@/lib/types/types";
import OrderCard from "@/components/orderCard";
import { DashboardDescription } from "@/components/sections/heroSections";
import StatisticsCard from "@/components/stats/Cards";
import { Button } from "@/components/ui/button";

const LOW_STOCK_THRESHOLD = 5;

const isSameDay = (dateA: Date, dateB: Date) =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate();

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value: string) =>
  new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function Dashboard() {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [totals, setTotals] = useState<TotalStatistics[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [imagesCount, setImagesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);

      try {
        const [recentOrdersResponse, ordersResponse, totalsResponse, inventoriesResponse, images] =
          await Promise.all([
            getRecentOrdersAPI(),
            getOrdersAPI(),
            getTotalsAPI(),
            getInventories(),
            getImagesAPI(),
          ]);

        setRecentOrders(recentOrdersResponse);
        setTotals(totalsResponse);
        setInventories(inventoriesResponse);
        setImagesCount(images.length);

        if (ordersResponse.ok) {
          setAllOrders(ordersResponse.data);
        } else {
          setAllOrders([]);
          console.error("Failed to fetch orders:", ordersResponse.error);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const dashboardMetrics = useMemo(() => {
    const now = new Date();
    const sortedOrders = [...allOrders].sort(
      (a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime(),
    );

    const todayOrders = sortedOrders.filter((order) =>
      isSameDay(new Date(order.appointmentDate), now),
    );
    const pendingOrders = sortedOrders.filter((order) => order.status === OrderStatus.PENDING);
    const upcomingOrders = sortedOrders.filter(
      (order) =>
        new Date(order.appointmentDate).getTime() >= now.getTime() &&
        order.status !== OrderStatus.CANCELLED,
    );
    const unassignedOrders = sortedOrders.filter(
      (order) => order.cleaners.length < order.requestedCleanerCount,
    );
    const completedOrders = sortedOrders.filter((order) => order.status === OrderStatus.COMPLETED);
    const activeRevenue = sortedOrders
      .filter((order) => order.status !== OrderStatus.CANCELLED)
      .reduce((sum, order) => sum + order.totalPrice, 0);
    const lowStockItems = inventories.filter(
      (inventory) => inventory.amount <= LOW_STOCK_THRESHOLD,
    );
    const completionRate =
      sortedOrders.length > 0
        ? Math.round((completedOrders.length / sortedOrders.length) * 100)
        : 0;

    return {
      todayOrders,
      pendingOrders,
      upcomingOrders,
      unassignedOrders,
      lowStockItems,
      completionRate,
      activeRevenue,
    };
  }, [allOrders, inventories]);

  const topLowStockItems = dashboardMetrics.lowStockItems.slice(0, 4);
  const nextOrders = dashboardMetrics.upcomingOrders.slice(0, 4);
  const visibleRecentOrders = recentOrders.slice(0, 4);

  return (
    <div className="p-10">
      <DashboardDescription
        h1="Control Center, Admin"
        p="Keep the business moving from one place. Review booking pressure, spot supply issues early, and jump straight into the areas that need attention today."
        upperH1="Daily Operations"
        highlight="Admin"
      >
        <div className="hidden gap-3 xl:flex">
          <Button
            asChild
            size="normal"
          >
            <Link href="/dashboard/orders">Review orders</Link>
          </Button>
          <Button
            asChild
            size="normal"
            variant="secondary"
          >
            <Link href="/dashboard/inventory">Check inventory</Link>
          </Button>
        </div>
      </DashboardDescription>

      <div className="mt-10 flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-wide text-slate-400 uppercase">
              Today&apos;s bookings
            </p>
            <h2 className="mt-3 text-4xl font-bold">{dashboardMetrics.todayOrders.length}</h2>
            <p className="mt-2 text-sm text-slate-500">
              Appointments scheduled for today&apos;s calendar.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-wide text-slate-400 uppercase">
              Pending approvals
            </p>
            <h2 className="mt-3 text-4xl font-bold">{dashboardMetrics.pendingOrders.length}</h2>
            <p className="mt-2 text-sm text-slate-500">
              Orders waiting for confirmation or assignment.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-wide text-slate-400 uppercase">
              Active revenue
            </p>
            <h2 className="mt-3 text-4xl font-bold">
              {formatCurrency(dashboardMetrics.activeRevenue)}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Scheduled order value excluding cancelled bookings.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-wide text-slate-400 uppercase">
              Completion rate
            </p>
            <h2 className="mt-3 text-4xl font-bold">{dashboardMetrics.completionRate}%</h2>
            <p className="mt-2 text-sm text-slate-500">
              Completed orders across the current order history.
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold tracking-wide text-slate-400 uppercase">
                  Upcoming schedule
                </p>
                <h2 className="mt-2 text-2xl font-bold">Next appointments</h2>
              </div>
              <Button
                asChild
                variant="secondary"
                size="normal"
              >
                <Link href="/dashboard/orders">Open orders</Link>
              </Button>
            </div>

            <div className="mt-6 space-y-3">
              {isLoading ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-slate-500">
                  Loading schedule...
                </div>
              ) : nextOrders.length > 0 ? (
                nextOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-lg font-semibold">Order #{order.id}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {order.customer.firstName} {order.customer.lastName}
                        </p>
                      </div>
                      <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-3 md:text-right">
                        <div>
                          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                            Time
                          </p>
                          <p className="mt-1">{formatDate(order.appointmentDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                            Team
                          </p>
                          <p className="mt-1">
                            {order.cleaners.length}/{order.requestedCleanerCount} assigned
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                            Value
                          </p>
                          <p className="mt-1">{formatCurrency(order.totalPrice)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-slate-500">
                  No upcoming appointments found.
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold tracking-wide text-slate-400 uppercase">
                Needs attention
              </p>
              <h2 className="mt-2 text-2xl font-bold">Operations snapshot</h2>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Unassigned orders</p>
                  <p className="mt-1 text-3xl font-bold">
                    {dashboardMetrics.unassignedOrders.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Low stock items</p>
                  <p className="mt-1 text-3xl font-bold">{dashboardMetrics.lowStockItems.length}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Media assets</p>
                  <p className="mt-1 text-3xl font-bold">{imagesCount}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold tracking-wide text-slate-400 uppercase">
                    Stock watch
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">Low inventory items</h2>
                </div>
                <Button
                  asChild
                  variant="secondary"
                  size="normal"
                >
                  <Link href="/dashboard/inventory">Open inventory</Link>
                </Button>
              </div>

              <div className="mt-6 space-y-3">
                {topLowStockItems.length > 0 ? (
                  topLowStockItems.map((inventory) => (
                    <div
                      key={inventory.id}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                    >
                      <div>
                        <p className="font-semibold">{inventory.name}</p>
                        <p className="text-sm text-slate-500">{inventory.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                          Remaining
                        </p>
                        <p className="mt-1 text-lg font-bold">
                          {inventory.amount} {inventory.unit}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-slate-500">
                    Inventory looks healthy right now.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-wide text-slate-400 uppercase">
                Recent activity
              </p>
              <h2 className="mt-2 text-2xl font-bold">Recent orders</h2>
            </div>
            <Button
              asChild
              size="normal"
            >
              <Link href="/dashboard/orders">See all orders</Link>
            </Button>
          </div>

          <div className="mt-6 space-y-4">
            {isLoading ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-500">
                Loading recent orders...
              </div>
            ) : visibleRecentOrders.length > 0 ? (
              visibleRecentOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-500">
                No recent orders available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
