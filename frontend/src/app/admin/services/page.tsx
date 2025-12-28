import { getPackages } from "@/features/packages/actions";
import { getResourceGroups } from "@/features/resources/actions";
import { ServicesPage } from "@/features/services";
import {
  getServiceCategories,
  getServices,
  getSkills,
} from "@/features/services/actions";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const { page, search, status } = await searchParams;
  const pageNumber = Number(page) || 1;

  // Parallel data fetching - start everything at once
  const skillsPromise = getSkills();
  const resourceGroupsPromise = getResourceGroups();
  const categoriesPromise = getServiceCategories();
  const servicesPromise = getServices(pageNumber, 10, search);
  const packagesPromise = getPackages(pageNumber, 10, search, status);

  return (
    <Suspense fallback={<div>Đang tải nội dung...</div>}>
      <ServicesPage
        page={pageNumber}
        servicesPromise={servicesPromise}
        packagesPromise={packagesPromise}
        skillsPromise={skillsPromise}
        categoriesPromise={categoriesPromise}
        resourceGroupsPromise={resourceGroupsPromise}
      />
    </Suspense>
  );
}
