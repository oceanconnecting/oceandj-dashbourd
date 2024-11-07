/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart";

const chartConfig = {
  desktop: {
    label: "Orders",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface MonthlyOrderCount {
  month: string; // Should be in "YYYY-MM" format
  totalOrders: number;
}

interface MonthlyOrderData {
  data: MonthlyOrderCount[];
}

export function OverView({ data }: MonthlyOrderData) {
  const [chartData, setChartData] = useState<{ month: string; desktop: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getMonthRange = () => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 5); // Start 5 months back
    const startMonth = monthNames[currentDate.getMonth()];
    const startYear = currentDate.getFullYear();

    const endMonth = monthNames[new Date().getMonth()];
    const endYear = new Date().getFullYear();

    return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
  };

  useEffect(() => {
    if (!data) return;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const lastSixMonthsData = data
      .map((monthData) => {
        const [year, month] = monthData.month.split("-").map(Number);
        const monthName = monthNames[month - 1];
        return {
          month: `${monthName} ${year}`,
          desktop: monthData.totalOrders,
          date: new Date(year, month - 1),
        };
      })
      .filter((monthData) => {
        const monthDiff = (currentYear - monthData.date.getFullYear()) * 12 + (currentMonth - monthData.date.getMonth());
        return monthDiff >= 0 && monthDiff < 6;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(({ month, desktop }) => ({ month, desktop }));

    setChartData(lastSixMonthsData);
    setLoading(false);
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart</CardTitle>
        <CardDescription>{getMonthRange()}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading chart...</div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.split(" ")[0].slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total orders for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
