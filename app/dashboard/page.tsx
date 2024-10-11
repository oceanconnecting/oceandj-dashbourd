import { DashboardContent } from "@/components/content/dashboard-content";
import { ContentLayout } from "@/components/content-layout";

export default async function DashboardPage() {
  return (
    <ContentLayout title="Dashboard">
      <DashboardContent />
    </ContentLayout>
  );
}
