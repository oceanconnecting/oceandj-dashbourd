/* eslint-disable @typescript-eslint/no-explicit-any */
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
  month: string;
  totalOrders: number;
}

interface MonthlyOrderData {
  data: MonthlyOrderCount[];
}

export function OverView({ data }: MonthlyOrderData) {
  const [chartData, setChartData] = useState<{ month: string; desktop: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        if (data) {
          const transformedData = data.map((monthData) => ({
            month: new Date(monthData.month).toLocaleString('default', { month: 'long' }),
            desktop: monthData.totalOrders,
          }));
          setChartData(transformedData);
        }
      } catch (error) {
        console.error("Error fetching monthly orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart</CardTitle>
        <CardDescription>January - December 2024</CardDescription>
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
                tickFormatter={(value) => value.slice(0, 3)}
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
