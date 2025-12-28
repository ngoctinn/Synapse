import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton";

export function PackageTableSkeleton() {
  return (
    <DataTableSkeleton
      columnCount={6}
      rowCount={5}
      searchable={false}
      filterable={false}
      showAction={false}
      variant="flush"
    />
  );
}
