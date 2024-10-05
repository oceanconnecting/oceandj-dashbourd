// import Link from "next/link";
// import { authOptions } from "@/lib/auth"
// import { getServerSession } from "next-auth"
import { DashboardContent } from "@/components/content/dashboard-content";
import { ContentLayout } from "@/components/content-layout";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator
// } from "@/components/ui/breadcrumb";

export default async function DashboardPage() {
  // const session = await getServerSession(authOptions);
  // console.log(session)
  return (
    <ContentLayout title="Dashboard">
      {/* <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> */}
      {/* {session?.user.email} */}
      <DashboardContent />
    </ContentLayout>
  );
}
