"use client";

import { PageFooter } from "@/shared/components/layout/components/page-footer";
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
      <Tabs
        value={activeTab}
        className="flex w-full flex-1 flex-col gap-0"
        onValueChange={handleTabChange}
      >
        <PageHeader>
          <TabsList variant="default" size="default">
            <TabsTrigger value="list" variant="default" stretch={false}>
              Danh sách
            </TabsTrigger>
            <TabsTrigger value="insights" variant="default" stretch={false}>
              Thông tin
            </TabsTrigger>
          </TabsList>

          <div className="flex w-full items-center gap-3 md:w-auto">
            {activeTab === "list" && (
              <FilterBar
                startContent={
                  <Input
                    placeholder="Tìm kiếm khách hàng..."
                    defaultValue={initialSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    startContent={
                      <Search className="text-muted-foreground size-4" />
                    }
                    className="bg-background h-9 w-full md:w-[250px]"
                  />
                }
                endContent={<CustomerFilter />}
              />
            )}
            <CreateCustomerTrigger />
          </div>
        </PageHeader>

        <div className="page-entry-animation flex flex-1 flex-col overflow-hidden">
          <TabsContent
            value="list"
            className="mt-0 flex flex-1 flex-col border-0 p-0 data-[state=inactive]:hidden"
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
              <PageFooter />
            </PageContent>
          </TabsContent>

          <TabsContent
            value="insights"
            className="mt-0 flex flex-1 flex-col border-0 p-0 data-[state=inactive]:hidden"
          >
            <PageContent>
              <SurfaceCard className="text-muted-foreground items-center justify-center p-8">
                <p>
                  Tính năng báo cáo và thông tin chi tiết khách hàng đang được
                  phát triển.
                </p>
              </SurfaceCard>
              <PageFooter />
            </PageContent>
          </TabsContent>
        </div>
      </Tabs>
    </PageShell>
  );
}
