"use client";

import { PageContent, PageHeader, PageShell, SurfaceCard } from "@/shared/components/layout/page-layout";
import { Button } from "@/shared/ui/button";
import { FilterBar } from "@/shared/ui/custom/filter-bar";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Loader2, XCircle } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useDebounce } from "use-debounce";
import { getReviews } from "../actions";
import { REVIEW_RATING_LABELS } from "../constants";
import { Review, ReviewFilters, ReviewRating } from "../types";
import { ReviewList } from "./review-list";

export function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useState<ReviewFilters>({
    search: "",
    rating: [],
  });
  const [debouncedSearch] = useDebounce(filters.search, 500);

  const loadReviews = () => {
    startTransition(async () => {
      const res = await getReviews({
        ...filters,
        search: debouncedSearch,
      });
      if (res.status === "success" && res.data) {
        setReviews(res.data);
      }
    });
  };

  useEffect(() => {
    loadReviews();
  }, [debouncedSearch, filters.rating]);

  const handleRatingChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      rating: value ? [parseInt(value) as ReviewRating] : [],
    }));
  };

  const handleClearFilters = () => {
    setFilters({ search: "", rating: [] });
  };

  return (
    <PageShell>
      <PageHeader>
        <h1 className="text-2xl font-bold tracking-tight shrink-0 mr-4">Quản lý đánh giá</h1>
        <FilterBar
          className="w-full justify-between"
          startContent={
             <div className="flex items-center gap-2 flex-1 w-full md:w-auto md:min-w-[300px]">
                <Input
                    id="search"
                    placeholder="Tìm kiếm đánh giá..."
                    onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                    className="h-9 w-full"
                />
            </div>
          }
          endContent={
            <div className="flex items-center gap-2">
                <Select
                    value={filters.rating?.[0]?.toString() || ""}
                    onValueChange={handleRatingChange}
                >
                    <SelectTrigger size="sm" className="w-[150px]">
                    <SelectValue placeholder="Tất cả sao" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="">Tất cả sao</SelectItem>
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                        {rating} sao ({REVIEW_RATING_LABELS[rating as ReviewRating]})
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>

                {(filters.search || (filters.rating?.length ?? 0) > 0) && (
                <Button variant="outline" size="sm" onClick={handleClearFilters}>
                    <XCircle className="h-3.5 w-3.5" />
                    Xóa
                </Button>
                )}
            </div>
          }
        />
      </PageHeader>

      <PageContent>
        {/* Reviews List */}
        <SurfaceCard>
            {isPending && reviews.length === 0 ? (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            ) : (
            <ReviewList reviews={reviews} emptyMessage="Không tìm thấy đánh giá nào." />
            )}
        </SurfaceCard>
      </PageContent>
    </PageShell>
  );
}
