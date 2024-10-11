import Link from "next/link";

import { ProductsContent } from "@/components/content/products-content";
import { ContentLayout } from "@/components/content-layout";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { PlusIcon } from "@radix-ui/react-icons"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Products Page",
};
export default function ProductsPage() {
  return (
    <ContentLayout title="Products">
      <Breadcrumb>
      <div className="flex items-center justify-between">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
          <Button className="rounded-lg hover:bg-background/60 text-base h-10 px-4" variant="outline">
            <Link href="/dashboard/products/add-product" className="flex justify-between items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              <span className="text-sm">Add Product</span>
            </Link>
          </Button>
        </div>
      </Breadcrumb>
      <ProductsContent />
    </ContentLayout>
  );
}
