"use client";

import { TotalStatistics } from "@/lib/types/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function StatisticsCard({ totals }: { totals: TotalStatistics[] }) {
  return (
    <div className="mx-auto flex w-full gap-4">
      {totals.map((item, index) => {
        return (
          <Card
            className="flex-1 p-0"
            key={index}
          >
            <CardContent className="flex w-full flex-wrap items-center px-0 lg:flex-nowrap">
              <div className="border-border w-full border-e last:border-e-0">
                <div className="p-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start justify-between">
                      <h5 className="w-full text-base font-medium">{item.title}</h5>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h5 className="text-2xl font-semibold">{item.subtitle}</h5>
                      <div className="flex items-center gap-2">
                        <p className="text-muted-foreground text-xs">Last 7 days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
