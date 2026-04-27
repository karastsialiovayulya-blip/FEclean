"use client";

import { MonthlyOrders } from "@/lib/types/types";
import { BitcoinUp02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type AnalyticsRecord = MonthlyOrders & Record<string, unknown>;

export const description = "A linear orders chart";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const NUMBER_WORDS: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
};

const chartConfig = {
  orders: {
    label: "Orders",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const normalizeMonth = (value: unknown) => {
  if (typeof value === "number" && value >= 1 && value <= 12) {
    return MONTHS[value - 1];
  }

  const rawValue = String(value ?? "").trim();
  if (!rawValue) {
    return null;
  }

  const numericMonth = Number(rawValue);
  if (!Number.isNaN(numericMonth) && numericMonth >= 1 && numericMonth <= 12) {
    return MONTHS[numericMonth - 1];
  }

  const normalizedLabel = rawValue.toLowerCase();
  const matchedMonth = MONTHS.find((month) => month.toLowerCase() === normalizedLabel);
  if (matchedMonth) {
    return matchedMonth;
  }

  const partialMatch = MONTHS.find((month) => month.toLowerCase().startsWith(normalizedLabel));
  if (partialMatch) {
    return partialMatch;
  }

  const parsedDate = new Date(rawValue);
  if (!Number.isNaN(parsedDate.getTime())) {
    return MONTHS[parsedDate.getMonth()];
  }

  return null;
};

const normalizeOrderCount = (value: unknown) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const rawValue = String(value ?? "")
    .trim()
    .toLowerCase();
  if (!rawValue) {
    return 0;
  }

  const numericValue = Number(rawValue);
  if (!Number.isNaN(numericValue)) {
    return numericValue;
  }

  const embeddedNumber = rawValue.match(/-?\d+(\.\d+)?/);
  if (embeddedNumber) {
    return Number(embeddedNumber[0]);
  }

  const compactValue = rawValue.replace(/[^a-z-]/g, "");
  return NUMBER_WORDS[compactValue] ?? 0;
};

const pickMonthValue = (item: AnalyticsRecord) =>
  item.month ??
  item.monthNumber ??
  item.month_name ??
  item.monthName ??
  item.date ??
  item.appointmentDate ??
  item.label ??
  item.name;

const pickOrderCountValue = (item: AnalyticsRecord) =>
  item.orderCount ?? item.orders ?? item.totalOrders ?? item.count ?? item.total ?? item.value;

const buildChartData = (chartData: AnalyticsRecord[]) => {
  const totals = new Map<string, number>();

  for (const item of chartData) {
    const month = normalizeMonth(pickMonthValue(item));

    if (!month) {
      continue;
    }

    const orderCount = normalizeOrderCount(pickOrderCountValue(item));
    const currentCount = totals.get(month) ?? 0;

    totals.set(month, currentCount + orderCount);
  }

  return MONTHS.map((month) => ({
    month,
    orders: totals.get(month) ?? 0,
  }));
};

export default function OrdersChart({ chartData }: { chartData: MonthlyOrders[] }) {
  const normalizedChartData = buildChartData(chartData as AnalyticsRecord[]);
  const totalOrders = normalizedChartData.reduce((sum, item) => sum + item.orders, 0);
  const activeMonths = normalizedChartData.filter((item) => item.orders > 0).length;
  const busiestMonth = normalizedChartData.reduce(
    (best, item) => (item.orders > best.orders ? item : best),
    normalizedChartData[0] ?? { month: "N/A", orders: 0 },
  ) ?? { month: "N/A", orders: 0 };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">Orders Analytics</CardTitle>
        <CardDescription className="text-base">
          Monthly order totals normalized from your analytics API response
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[320px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={normalizedChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => String(value).slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  hideLabel
                />
              }
            />
            <Area
              dataKey="orders"
              type="monotone"
              fill="var(--color-orders)"
              fillOpacity={0.35}
              stroke="var(--color-orders)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-base leading-none font-medium">
              Total orders: {totalOrders} <HugeiconsIcon icon={BitcoinUp02Icon} />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-base leading-none">
              Active months: {activeMonths} • Busiest month: {busiestMonth.month} (
              {busiestMonth.orders})
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
