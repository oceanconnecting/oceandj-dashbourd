/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { RecentSales } from "@/components/recent-sales";
import { OverView } from "@/components/over-view";
import { Table } from "@/components/top-products/table";
import { DollarSign, Package, Boxes, CreditCard } from "lucide-react";
// import NumberTicker from "@/components/ui/number-ticker";

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
  const [ordersDelivered, setOrdersDelivered] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [yourStock, setYourStock] = useState<number | null>(0);
  const [productsSales, setProductsSales] = useState<number | null>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [ordersPerType, setOrdersPerType] = useState<OrdersPerType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ? Calculating in front-end
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all orders and products in parallel
        const [ordersRes, productsRes] = await Promise.all([
          fetch('/api/orders/list-orders?limit=all'),
          fetch('/api/products/list-products?limit=all'),
        ]);
  
        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();
  
        if (ordersData.success) {
          const allOrders: Order[] = ordersData.orders;
          console.log(allOrders)
  
          // Calculate bar chart
          const monthlyOrderCountMap = new Map<string, number>();
          allOrders.forEach((order) => {
            const orderDate = new Date(order.createdAt);
            const month = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
  
            monthlyOrderCountMap.set(month, (monthlyOrderCountMap.get(month) || 0) + 1);
          });
  
          const monthlyOrderCount: MonthlyOrderCount[] = Array.from(monthlyOrderCountMap, ([month, totalOrders]) => ({
            month,
            totalOrders,
          }));
          setMonthlyOrderCount(monthlyOrderCount);
  
          // Calculate total revenue
          const calculatedTotal = allOrders.reduce((sum, order) => {
            const orderTotalPrice = order.items.reduce((total: number, item: OrderItem) => {
              const discount = item.discount ?? 0;
              const itemTotal = item.price * item.quantity * (1 - discount / 100);
              return total + itemTotal;
            }, 0);
            return sum + orderTotalPrice;
          }, 0);
          setTotalRevenue(parseFloat(calculatedTotal.toFixed(2)));
  
          // Calculate orders Delivered
          const deliveredOrdersCount = allOrders.filter(order => order.status === 'Delivered').length;
          setOrdersDelivered(deliveredOrdersCount);
  
          // Calculate total delivered products
          const totalDeliveredProducts = allOrders
            .filter(order => order.status === 'Delivered')
            .reduce((total, order) => total + order.items.reduce((sum, item) => sum + item.quantity, 0), 0);
          setProductsSales(totalDeliveredProducts);
        }
  
        if (productsData.success) {
          const products: Product[] = productsData.products;
  
          // Calculate total stock
          const calculatedTotalStock = products.reduce((sum, product) => sum + (product.stock || 0), 0);
          setYourStock(calculatedTotalStock);
  
          // Calculate orders per type for pie chart
          const calculatedOrdersPerType: OrdersPerType[] = products.reduce((acc: OrdersPerType[], product) => {
            const typeId = product.category?.type?.id ?? null;
            const orderCount = product.orderCount ?? 0;
  
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
  
          // Display top products
          const topProducts = products
            .sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0))
            .slice(0, 5);
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


  // ? Calculating in back-end
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const [
  //         totalRevenueRes,
  //         yourStockRes,
  //         ordersDeliveredRes,
  //         productsSalesRes,
  //         barChartRes,
  //         pieChartRes,
  //         topProductsRes,
  //       ] = await Promise.all([
  //         fetch('/api/dashboard/total-revenue'),
  //         fetch('/api/dashboard/your-stock'),
  //         fetch('/api/dashboard/orders-reseved'),
  //         fetch('/api/dashboard/products-sales'),
  //         fetch('/api/dashboard/bar-chart'),
  //         fetch('/api/dashboard/pie-chart'),
  //         fetch('/api/products/top-products'),
  //       ]);
  
  //       const totalRevenueData = await totalRevenueRes.json();
  //       const yourStockData = await yourStockRes.json();
  //       const ordersDeliveredData = await ordersDeliveredRes.json();
  //       const productsSalesData = await productsSalesRes.json();
  //       const barChartData = await barChartRes.json();
  //       const pieChartData = await pieChartRes.json();
  //       const topProductsData = await topProductsRes.json();
  
  //       if (totalRevenueData.success) setTotalRevenue(parseFloat(totalRevenueData.totalSum));
  //       if (yourStockData.success) setYourStock(yourStockData.totalStock);
  //       if (ordersDeliveredData.success) setOrdersDelivered(ordersDeliveredData.count);
  //       if (productsSalesData.success) setProductsSales(productsSalesData.totalProducts);
  //       if (barChartData.success) setMonthlyOrderCount(barChartData.monthlyOrderCount);
  //       if (pieChartData.success) setOrdersPerType(pieChartData.ordersPerType);
  //       if (topProductsData.success) setTopProducts(topProductsData.products);
  
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  
  //   fetchData();
  // }, []);

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
                    // <p className="text-3xl font-bold pt-1">$<NumberTicker value={Number(totalRevenue?.toFixed(2)) ?? 0} /></p>
                    <div className="text-3xl font-bold pt-1">
                      ${totalRevenue?.toFixed(2) ?? 0}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Total Products</CardTitle>
                  <Boxes className="w-6 h-6" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-2xl font-bold">Loading...</div>
                  ) : (
                    // <p className="text-3xl font-bold pt-1">+<NumberTicker value={yourStock ?? 0} /></p>
                    <div className="text-3xl font-bold pt-1">
                      +{yourStock ?? 0}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Orders Delivered</CardTitle>
                  <CreditCard className="w-6 h-6" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-2xl font-bold">Loading...</div>
                  ) : (
                    // <p className="text-3xl font-bold pt-1">+<NumberTicker value={ordersDelivered ?? 0} /></p>
                    <div className="text-3xl font-bold pt-1">
                      +{ordersDelivered ?? 0}
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
                    // <p className="text-3xl font-bold pt-1">+<NumberTicker value={productsSales ?? 0} /></p>
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
