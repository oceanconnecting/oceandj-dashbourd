"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A donut chart with text"

const chartConfig = {
  orderCount: {
    label: "Orders",
  },
  type10: {
    label: "Type 10",
    color: "hsl(var(--chart-1))",
  },
  type12: {
    label: "Type 12",
    color: "hsl(var(--chart-2))",
  },
  type11: {
    label: "Type 11",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function RecentSales() {
  const [chartData, setChartData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/dashboard/pie-chart");
        const data = await response.json();

        if (data.success) {
          const transformedData = data.ordersPerType.map(order => ({
            type: `Type ${order.typeId}`,
            orders: order.orderCount,
            fill: order.color,
          }));
          console.log(data.ordersPerType)
          setChartData(transformedData);
        }
      } catch (err) {
        setError("Failed to fetch data : ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  const totalOrders = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.orders, 0);
  }, [chartData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>Orders Overview</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="orders"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalOrders.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Orders
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {/* <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="leading-none text-muted-foreground">
          Showing total orders for the last period
        </div>
      </CardFooter>
    </Card>
  )
}