import Link from "next/link";
// import { ApisContent } from "@/components/content/apis-content";
import { ContentLayout } from "@/components/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export default function ApisPage() {
  return (
    <ContentLayout title="Categories">
      <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Apis</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
      </Breadcrumb>
      <h1>Admins Page</h1>
    </ContentLayout>
  );
}
