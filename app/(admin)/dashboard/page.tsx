"use client";

import { useEffect, useState } from "react";
import { getRecentOrdersAPI } from "@/lib/api/actions/analytics";
import { Order } from "@/lib/types/types";
import OrderCard from "@/components/orderCard";
import { DashboardDescription } from "@/components/sections/heroSections";

export default function Dashboard() {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchRecentOrders() {
      try {
        const response = await getRecentOrdersAPI();
        setRecentOrders(response);
      } catch (error) {
        console.error("Error fetching recent orders:", error);
      }
    }

    fetchRecentOrders();
  }, []);

  return (
    <div className="p-10">
      <DashboardDescription
        h1="Good Morning, Admin"
        p="Welcome back to your dashboard! Here you can manage your cleaning services, track orders, and gain insights into your business performance. Use the navigation menu to explore different sections and stay on top of your operations."
        upperH1="System Overview"
        highlight="Admin"
      ></DashboardDescription>
      <div className="mt-8 space-y-4 rounded-lg bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold">Recent Orders</h2>
        {recentOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
          />
        ))}
      </div>
    </div>
  );
}
