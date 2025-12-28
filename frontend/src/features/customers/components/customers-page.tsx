"use client";

import {
  PageContent,
  PageHeader,
  PageShell,
  SurfaceCard,
} from "@/shared/components/layout/page-layout";
import { ActionResponse } from "@/shared/lib/action-response";
import { VStack } from "@/shared/ui/layout/stack";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, use, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { CustomerListResponse } from "../model/types";
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
  searchProps,
}: {
  customerListPromise: Promise<ActionResponse<CustomerListResponse>>;
  page: number;
  searchProps: {
    initialValue: string;
    onSearch: (term: string) => void;
  };
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
      searchProps={searchProps}
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
        onValueChange={handleTabChange}
        className="flex flex-col gap-0"
      >
        <PageHeader
           title="Khách hàng"
           subtitle="Quản lý hồ sơ, lịch sử dịch vụ và thông tin liên hệ của khách hàng."
        >
          <TabsList size="sm">
            <TabsTrigger value="list" stretch={false}>
              Danh sách
            </TabsTrigger>
            <TabsTrigger value="insights" stretch={false}>
              Thông tin chi tiết
            </TabsTrigger>
          </TabsList>
        </PageHeader>

        <VStack gap={0} className="page-entry-animation overflow-hidden">
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
                    searchProps={{
                      initialValue: initialSearch,
                      onSearch: handleSearch,
                    }}
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
              <SurfaceCard className="text-muted-foreground flex items-center justify-center p-8">
                Tính năng báo cáo và thông tin chi tiết khách hàng đang được phát triển.
              </SurfaceCard>
            </PageContent>
          </TabsContent>
        </VStack>
      </Tabs>
  </PageShell>
  );
}
