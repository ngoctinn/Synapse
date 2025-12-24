import { PaginationControls } from "@/shared/ui/custom/pagination-controls";

interface PageFooterProps {
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function PageFooter({ page, totalPages, onPageChange }: PageFooterProps) {
  return (
    <footer className="mt-auto flex w-full flex-col items-center justify-between gap-4 border-t py-6 md:flex-row md:px-6">
      <div className="text-muted-foreground order-2 text-sm md:order-1">
        © {new Date().getFullYear()} Synapse. All rights reserved.
      </div>
      {totalPages && totalPages > 1 && onPageChange && (
        <div className="order-1 md:order-2">
          <PaginationControls
            currentPage={page || 1}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </footer>
  );
}
