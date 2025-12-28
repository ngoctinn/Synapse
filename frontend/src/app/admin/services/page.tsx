import { getResourceGroups } from "@/features/resources/actions";
import { ServicesPage } from "@/features/services";
import { getServiceCategories, getServices, getSkills } from "@/features/services/actions";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const pageNumber = Number(page) || 1;

  const [skillsRes, resourceGroupsRes, categoriesRes] = await Promise.all([
    getSkills(),
    getResourceGroups(),
    getServiceCategories(),
  ]);

  const skills =
    skillsRes.status === "success" ? skillsRes.data || [] : [];
  const resourceGroups =
    resourceGroupsRes.status === "success" ? resourceGroupsRes.data || [] : [];
  const categories =
    categoriesRes.status === "success" ? categoriesRes.data || [] : [];

  const servicesPromise = getServices(pageNumber);

  return (
    <Suspense fallback={<div>Đang tải dịch vụ...</div>}>
      <ServicesPage
        page={pageNumber}
        servicesPromise={servicesPromise}
        skills={skills}
        categories={categories}
        resourceGroups={resourceGroups}
      />
    </Suspense>
  );
}
