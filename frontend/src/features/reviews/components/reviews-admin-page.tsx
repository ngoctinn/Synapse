"use client";

import {
    PageContent,
    PageHeader,
    PageShell,
    SurfaceCard,
} from "@/shared/components/layout/page-layout";
import { Button } from "@/shared/ui/button";
import { FilterBar } from "@/shared/ui/custom/filter-bar";
import { Input } from "@/shared/ui/input";
import { Group } from "@/shared/ui/layout";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";
import { Loader2, Search, XCircle } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useDebounce } from "use-debounce";
import { getReviews } from "../actions";
import { REVIEW_RATING_LABELS } from "../constants";
import { Review, ReviewFilters, ReviewRating } from "../model/types";
import { ReviewList } from "./review-list";

export function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useState<ReviewFilters>({
    search: "",
    rating: [],
  });
  const [debouncedSearch] = useDebounce(filters.search, 500);

  const loadReviews = useCallback(() => {
    startTransition(async () => {
      const res = await getReviews({
        ...filters,
        search: debouncedSearch,
      });
      if (res.status === "success" && res.data) {
        setReviews(res.data);
      }
    });
  }, [debouncedSearch, filters]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleRatingChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      rating: value !== "all" ? [parseInt(value) as ReviewRating] : [],
    }));
  };

  const handleClearFilters = () => {
    setFilters({ search: "", rating: [] });
  };

  return (
    <PageShell>
      <PageHeader title="Quản lý đánh giá">
        <FilterBar
          className="w-full justify-between"
          startContent={
            <div className="w-full flex-1 md:w-auto md:min-w-[300px]">
              <Input
                id="search"
                placeholder="Tìm kiếm đánh giá..."
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full"
                startContent={<Search size={16} className="text-muted-foreground" />}
                isSearch
              />
            </div>
          }
          endContent={
            <Group>
              <Select
                value={filters.rating?.[0]?.toString() || "all"}
                onValueChange={handleRatingChange}
              >
                <SelectTrigger size="sm" className="w-[150px]">
                  <SelectValue placeholder="Tất cả sao" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả sao</SelectItem>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} sao (
                      {REVIEW_RATING_LABELS[rating as ReviewRating]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(filters.search || (filters.rating?.length ?? 0) > 0) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Xóa
                </Button>
              )}
            </Group>
          }
        />
      </PageHeader>

      <PageContent>
        {/* Reviews List */}
        <SurfaceCard>
          {isPending && reviews.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
          ) : (
            <ReviewList
              reviews={reviews}
              emptyMessage="Không tìm thấy đánh giá nào."
            />
          )}
        </SurfaceCard>
      </PageContent>
    </PageShell>
  );
}
