"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { RecentSales } from "@/components/recent-sales";
import { OverView } from "@/components/over-view";
import { Table } from "@/components/top-products/table";
import { DollarSign, Package } from "lucide-react";

export const DashboardContent = () => {
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        const response = await fetch('/api/dashboard/total-revenue');
        const data = await response.json();
        if (data.success) {
          setTotalRevenue(parseFloat(data.totalSum));
        }
      } catch (error) {
        console.error('Failed to fetch total revenue:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchTotalProducts = async () => {
      try {
        const response = await fetch('/api/dashboard/total-products');
        const data = await response.json();
        if (data.success) {
          setTotalProducts(parseFloat(data.count));
        }
      } catch (error) {
        console.error('Failed to fetch total products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalRevenue();
    fetchTotalProducts();
  }, []);

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-semibold py-1">Hi, Welcome back 👋</h1>
      <div className="flex-1 space-y-4 pt-2">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="w-6 h-6" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-2xl font-bold">Loading...</div>
                  ) : (
                    <div className="text-3xl font-bold pt-1">
                      ${totalRevenue?.toFixed(2) ?? "N/A"}
                    </div>
                  )}
                  {/* <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p> */}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="">
                    Total Products
                  </CardTitle>
                  <Package className="w-6 h-6" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-2xl font-bold">Loading...</div>
                  ) : (
                    <div className="text-3xl font-bold pt-1">
                      +{totalProducts ?? "N/A"}
                    </div>
                  )}
                  {/* <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p> */}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="">Sales</CardTitle>
                  <Package className="w-6 h-6" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold pt-1">+12,234</div>
                  {/* <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p> */}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="">
                    Active Now
                  </CardTitle>
                  <Package className="w-6 h-6" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold pt-1">+573</div>
                  {/* <p className="text-xs text-muted-foreground">
                    +201 since last hour
                  </p> */}
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <OverView />
              </div>
              <div className="col-span-4 lg:col-span-3">
                <RecentSales />
              </div>
            </div>
            <div>
              <Table />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}