import { getServices, getSkills, ServicesPage } from "@/features/services";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý dịch vụ | Synapse",
  description: "Quản lý danh sách dịch vụ",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { page: pageParam, search } = await searchParams;
  const page = Number(pageParam) || 1;

  // Parallel data fetching
  // We await skills immediately for initial render (dialogs/filters need it)
  // We pass servicesPromise to be suspended inside the page
  const skillsPromise = getSkills();
  const servicesPromise = getServices(page, 10, search);

  const skills = await skillsPromise;

  return (
    <ServicesPage
      page={page}
      skills={skills.data}
      servicesPromise={servicesPromise}
    />
  );
}
