/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { RecentSales } from "@/components/recent-sales";
import { OverView } from "@/components/over-view";
import { Table } from "@/components/top-products/table";
import { DollarSign, Package } from "lucide-react";

interface MonthlyOrderCount {
  month: string;
  totalOrders: number;
}

interface Type {
  id: number;
  title: string;
}

interface OrderItem {
  price: number;
  quantity: number;
  discount: number | null;
}

interface Order {
  status?: string;
  items: OrderItem[];
  createdAt: string;
}

interface Product {
  stock: number;
  id: number;
  categoryId: number;
  category?: {
    type?: Type | null;
  };
  orderCount: number;
}

interface OrdersPerType {
  typeId: number | null;
  orderCount: number;
  color: string;
}

export const DashboardContent = () => {
  const [monthlyOrderCount, setMonthlyOrderCount] = useState<MonthlyOrderCount[]>([]);
  const [ordersReseved, setOrdersReseved] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [yourStock, setYourStock] = useState<number | null>(null);
  const [productsSales, setProductsSales] = useState<number | null>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [ordersPerType, setOrdersPerType] = useState<OrdersPerType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all orders and products in parallel
        const [ordersRes, productsRes] = await Promise.all([
          fetch('/api/orders/list-orders'),
          fetch('/api/products/list-products'),
        ]);

        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();

        if (ordersData.success) {
          const allOrders: Order[] = ordersData.orders;

          // Calculate bar chart
          const monthlyOrderCountMap = new Map<string, number>();

          allOrders.forEach((order) => {
            // console.log(order)
            const orderDate = new Date(order.createdAt);
            const month = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;

            if (monthlyOrderCountMap.has(month)) {
              monthlyOrderCountMap.set(month, monthlyOrderCountMap.get(month)! + 1);
            } else {
              monthlyOrderCountMap.set(month, 1);
            }
          });

          const monthlyOrderCount: MonthlyOrderCount[] = Array.from(monthlyOrderCountMap, ([month, totalOrders]) => ({
            month,
            totalOrders,
          }));

          // console.log(monthlyOrderCount);
          setMonthlyOrderCount(monthlyOrderCount);


          // Calculate total revenue
          const calculatedTotal = allOrders.reduce((sum, order) => {
            const orderTotalPrice = order.items.reduce((total, item) => {
              const discount = item.discount ?? 0;
              const itemTotal = item.price * item.quantity * (1 - discount / 100);
              return total + itemTotal;
            }, 0);
            return sum + orderTotalPrice;
          }, 0);
          setTotalRevenue(parseFloat(calculatedTotal.toFixed(2)));

          // Calculate orders reserved
          const reservedOrdersCount = allOrders.filter(order => order.status === 'Reseved').length;
          setOrdersReseved(reservedOrdersCount);

          // Calculate total reserved products
          const totalReservedProducts = allOrders
            .filter(order => order.status === 'Reseved')
            .reduce((total, order) => {
              const orderTotal = order.items.reduce((sum, item) => sum + item.quantity, 0);
              return total + orderTotal;
            }, 0);
          setProductsSales(totalReservedProducts);
        }

        if (productsData.success) {
          const products: Product[] = productsData.products;

          // Calculate total stock
          const calculatedTotalStock = products.reduce((sum, product) => sum + (product.stock || 0), 0);
          setYourStock(calculatedTotalStock);

          // Calculate orders per type for pie chart
          const calculatedOrdersPerType: OrdersPerType[] = products.reduce((acc: OrdersPerType[], product) => {
            const typeId = product.category?.type?.id ?? null;
            const orderCount = product.orderCount;

            if (typeId !== null) {
              const existingEntry = acc.find(entry => entry.typeId === typeId);
              if (existingEntry) {
                existingEntry.orderCount += orderCount;
              } else {
                const colorIndex = acc.length + 1;
                const color = `hsl(var(--color-type-${colorIndex}))`;
                acc.push({ typeId, orderCount, color });
              }
            }
            return acc;
          }, []);
          setOrdersPerType(calculatedOrdersPerType);

          // Affiche top products
          // Sort products by orderCount in descending order and select the top 5
          const topProducts = products
            .sort((a, b) => b.orderCount - a.orderCount)
            .slice(0, 5);

          // Display the top product(s)
          // console.log("Top Product:", topProducts);
          setTopProducts(topProducts);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
                  <CardTitle>Total Revenue</CardTitle>
                  <DollarSign className="w-6 h-6" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-2xl font-bold">Loading...</div>
                  ) : (
                    <div className="text-3xl font-bold pt-1">
                      ${totalRevenue?.toFixed(2) ?? 0}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Total Products</CardTitle>
                  <Package className="w-6 h-6" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-2xl font-bold">Loading...</div>
                  ) : (
                    <div className="text-3xl font-bold pt-1">
                      +{yourStock ?? 0}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Orders Reseved</CardTitle>
                  <Package className="w-6 h-6" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-2xl font-bold">Loading...</div>
                  ) : (
                    <div className="text-3xl font-bold pt-1">
                      +{ordersReseved ?? 0}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Products Sales</CardTitle>
                  <Package className="w-6 h-6" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-2xl font-bold">Loading...</div>
                  ) : (
                    <div className="text-3xl font-bold pt-1">
                      +{productsSales ?? 0}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <OverView data={monthlyOrderCount} />
              </div>
              <div className="col-span-4 lg:col-span-3">
                <RecentSales ordersPerType={ordersPerType} />
              </div>
            </div>
            <div>
              <Table topProducts={topProducts} loading={loading} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
