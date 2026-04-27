"use client";

import { useEffect, useState } from "react";
import { getOrdersByMonthAPI, getTopCleanersAPI, getTotalsAPI } from "@/lib/api/actions/analytics";
import { Cleaner, MonthlyOrders, TotalStatistics } from "@/lib/types/types";
import { DashboardDescription } from "@/components/sections/heroSections";
import StatisticsCard from "@/components/stats/Cards";
import ChartOderLinear from "@/components/stats/OrdersChart";

export default function Analytics() {
  const [totals, setTotals] = useState<TotalStatistics[]>([]);
  const [topCleaners, setTopCleaners] = useState<Cleaner[]>([]);
  const [monthlyOrders, setMonthlyOrders] = useState<MonthlyOrders[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [totals, topCleaners, monthlyOrders] = await Promise.all([
          getTotalsAPI(),
          getTopCleanersAPI(),
          getOrdersByMonthAPI(),
        ]);
        setTotals(totals);
        setTopCleaners(topCleaners);
        setMonthlyOrders(monthlyOrders);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-10">
      <DashboardDescription
        h1="Advanced Analytics"
        p="Unlock the power of data-driven insights with our comprehensive analytics dashboard. Monitor key performance indicators, track trends, and make informed decisions to optimize your cleaning business operations."
        upperH1="Enterprise Insights"
        highlight="Analytics"
      ></DashboardDescription>
      <div className="mt-10 flex flex-col gap-6">
        <StatisticsCard totals={totals} />
        <div className="flex gap-6">
          <div className="min-w-0 flex-2">
            <ChartOderLinear chartData={monthlyOrders} />
          </div>
          <div className="flex-1">
            <div className="bg-card text-card-foreground ring-foreground/10 flex min-w-0 flex-col gap-4 overflow-hidden rounded-lg p-4 text-xs/relaxed ring-1 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 *:[img:first-child]:rounded-t-lg *:[img:last-child]:rounded-b-lg">
              <h2 className="mb-4 text-2xl font-bold">Top Cleaners</h2>
              <div>
                {topCleaners.map((cleaner, index) => (
                  <div
                    key={cleaner.id}
                    className="flex items-center gap-2"
                  >
                    <div className="px-3 text-xl font-bold">{index + 1}</div>
                    <div className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2">
                      <div className="grid grid-cols-3 gap-4 md:items-center">
                        <div>
                          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                            Cleaner
                          </p>
                          <p className="mt-1 text-lg font-semibold">
                            {cleaner.firstName} {cleaner.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                            Experience
                          </p>
                          <p className="mt-1 text-sm text-slate-600">{cleaner.experience} years</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                            Raiting
                          </p>
                          <p className="mt-1 text-sm text-slate-600">{cleaner.rating}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
