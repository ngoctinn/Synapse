"use client";

import {
    PageContent,
    PageHeader,
    PageShell,
    SurfaceCard,
} from "@/shared/components/layout/page-layout";
import { ActionResponse } from "@/shared/lib/action-response";
import { FilterBar } from "@/shared/ui/custom/filter-bar";
import { Input } from "@/shared/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

import { Group, Stack } from "@/shared/ui/layout";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, use, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { CustomerListResponse } from "../actions";
import { CreateCustomerTrigger } from "./create-customer-trigger";
import { CustomerFilter } from "./customer-filter";
import {
    CustomerTable,
    CustomerTableSkeleton,
} from "./customer-list/customer-table";

interface CustomersPageProps {
  page: number;
  customerListPromise: Promise<ActionResponse<CustomerListResponse>>;
}

function CustomerListWrapper({
  customerListPromise,
  page,
}: {
  customerListPromise: Promise<ActionResponse<CustomerListResponse>>;
  page: number;
}) {
  const response = use(customerListPromise);

  if (response.status === "error") {
    return (
      <div className="text-destructive p-4 text-center">
        Lỗi tải dữ liệu: {response.message}
      </div>
    );
  }

  const { data, total } = response.data!;
  const totalPages = Math.ceil(total / 10);

  return (
    <CustomerTable
      data={data}
      page={page}
      totalPages={totalPages}
      variant="flush"
      className="border-none"
    />
  );
}

export function CustomersPage({
  page,
  customerListPromise,
}: CustomersPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [, startTransition] = useTransition();

  // Get active tab from URL or default to 'list'
  const activeTab = searchParams.get("view") || "list";

  // Get initial search query
  const initialSearch = searchParams.get("search")?.toString() || "";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("view", value);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    // Reset page to 1 when searching
    params.set("page", "1");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, 300);

  return (
    <PageShell>
      <Stack gap={0} asChild>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
        >
        <PageHeader>
          <TabsList size="default">
            <TabsTrigger value="list" stretch={false}>
              Danh sách
            </TabsTrigger>
            <TabsTrigger value="insights" stretch={false}>
              Thông tin
            </TabsTrigger>
          </TabsList>

          <Group gap={3} className="w-full md:w-auto">
            {activeTab === "list" && (
              <FilterBar
                startContent={
                  <div className="w-full md:w-[250px]">
                    <Input
                      placeholder="Tìm kiếm khách hàng..."
                      defaultValue={initialSearch}
                      onChange={(e) => handleSearch(e.target.value)}
                      startContent={<Search className="text-muted-foreground" size={16} />}
                      isSearch
                    />
                  </div>
                }
                endContent={<CustomerFilter />}
              />
            )}
            <CreateCustomerTrigger />
          </Group>
        </PageHeader>

        <Stack gap={0} className="page-entry-animation overflow-hidden">
          <TabsContent
            value="list"
            className="mt-0 data-[state=inactive]:hidden"
          >
            <PageContent>
              <SurfaceCard>
                <Suspense fallback={<CustomerTableSkeleton />}>
                  <CustomerListWrapper
                    customerListPromise={customerListPromise}
                    page={page}
                  />
                </Suspense>
              </SurfaceCard>
            </PageContent>
          </TabsContent>

          <TabsContent
            value="insights"
            className="mt-0 data-[state=inactive]:hidden"
          >
            <PageContent>
              <SurfaceCard className="text-muted-foreground items-center justify-center p-8">
                <p>
                  Tính năng báo cáo và thông tin chi tiết khách hàng đang được
                  phát triển.
                </p>
              </SurfaceCard>
            </PageContent>
          </TabsContent>
        </Stack>
      </Tabs>
    </Stack>
  </PageShell>
  );
}
