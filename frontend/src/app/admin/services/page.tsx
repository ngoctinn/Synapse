import { ServicesPage } from "@/features/services";
import { Suspense } from "react";
import { 
  getServices, 
  getSkills, 
  getServiceCategories 
} from "@/features/services";
import { getResourceGroups } from "@/features/resources";
import { getPackages } from "@/features/packages";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string; view?: string }>;
}) {
  const { page, search, view } = await searchParams;
  const pageNumber = Number(page) || 1;
  const searchTerm = search || "";
  const activeTab = view || "list";

  const servicesPromise = activeTab === "list" 
    ? getServices(pageNumber, 10, searchTerm) 
    : undefined;

  const skillsPromise = (activeTab === "list" || activeTab === "skills")
    ? getSkills()
    : undefined;

  const categoriesPromise = (activeTab === "list" || activeTab === "categories")
    ? getServiceCategories()
    : undefined;

  const resourceGroupsPromise = activeTab === "list"
    ? getResourceGroups()
    : undefined;

  const packagesPromise = activeTab === "packages"
    ? getPackages(pageNumber)
    : undefined;

  // Needed for creating packages
  const allServicesPromise = activeTab === "packages"
    ? getServices(1, 100, "", true)
    : undefined;

  return (
    <Suspense fallback={<div>Đang tải nội dung...</div>}>
      <ServicesPage
        page={pageNumber}
        search={searchTerm}
        servicesPromise={servicesPromise}
        skillsPromise={skillsPromise}
        categoriesPromise={categoriesPromise}
        resourceGroupsPromise={resourceGroupsPromise}
        packagesPromise={packagesPromise}
        allServicesPromise={allServicesPromise}
      />
    </Suspense>
  );
}