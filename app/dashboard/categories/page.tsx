import Link from "next/link";
import { CategoriesContent } from "@/components/content/categories-content";
import { ContentLayout } from "@/components/content-layout";
import { AddCategoryForm } from "@/components/form/add-category-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  title: "Categories",
  description: "Categories Page",
};
export default function CategoriesPage() {
  return (
    <ContentLayout title="Categories">
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
              <BreadcrumbPage>Categories</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
          <Dialog>
            <DialogTrigger>
              <Button className="rounded-lg hover:bg-background/60 space-x-2 text-base h-10 px-4" variant="outline">
                <PlusIcon className="w-4 h-4" />
                <span className="text-sm">Add category</span>
              </Button>
            </DialogTrigger>
            <AddCategoryForm />
          </Dialog>
        </div>
      </Breadcrumb>
      <CategoriesContent />
    </ContentLayout>
  );
}
