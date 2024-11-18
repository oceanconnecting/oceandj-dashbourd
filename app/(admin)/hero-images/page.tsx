import Link from "next/link";
import { ContentLayout } from "@/components/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import type { Metadata } from "next";
import { HeroImagesContent } from "@/components/content/hero-images-content";

export const metadata: Metadata = {
  title: "Hero Images",
  description: "Hero Images Page",
};

export default function OrdersPage() {
  return (
    <ContentLayout title="Hero">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Hero Images</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <HeroImagesContent />
    </ContentLayout>
  );
}