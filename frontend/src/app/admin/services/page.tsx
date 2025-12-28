import { getPackages } from "@/features/packages/actions";
import { getResourceGroups } from "@/features/resources/actions";
import { ServicesPage } from "@/features/services";
import { getServiceCategories, getServices, getSkills } from "@/features/services/actions";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const { page, search, status } = await searchParams;
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

  const servicesPromise = getServices(pageNumber, 10, search);
  const packagesPromise = getPackages(pageNumber, 10, search, status);

  return (
    <Suspense fallback={<div>Đang tải nội dung...</div>}>
      <ServicesPage
        page={pageNumber}
        servicesPromise={servicesPromise}
        packagesPromise={packagesPromise}
        skills={skills}
        categories={categories}
        resourceGroups={resourceGroups}
      />
    </Suspense>
  );
}
