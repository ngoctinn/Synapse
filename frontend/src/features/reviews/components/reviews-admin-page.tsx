"use client";

import { useEffect, useState, useTransition } from "react";
import { Review, ReviewFilters, ReviewRating } from "../types";
import { getReviews } from "../actions";
import { ReviewList } from "./review-list";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Label } from "@/shared/ui/label";
import { REVIEW_RATING_LABELS } from "../constants";
import { Button } from "@/shared/ui/button";
import { Filter, XCircle } from "lucide-react";
import { useDebounce } from "use-debounce";

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
    <div className="flex flex-col gap-6 p-6 h-full overflow-hidden">
      <h1 className="text-2xl font-bold tracking-tight">Quản lý đánh giá</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4 p-4 border rounded-lg bg-card">
        <div className="grid gap-2 flex-1 min-w-[200px]">
          <Label htmlFor="search">Tìm kiếm</Label>
          <Input
            id="search"
            placeholder="Tên khách hàng, dịch vụ..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          />
        </div>

        <div className="grid gap-2 min-w-[150px]">
          <Label htmlFor="rating">Rating</Label>
          <Select
            value={filters.rating?.[0]?.toString() || ""}
            onValueChange={handleRatingChange}
          >
            <SelectTrigger>
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
        </div>

        {(filters.search || filters.rating?.length > 0) && (
          <Button variant="outline" onClick={handleClearFilters} className="gap-2">
            <XCircle className="h-4 w-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Reviews List */}
      <div className="flex-1 overflow-hidden">
        {isPending && reviews.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ReviewList reviews={reviews} emptyMessage="Không tìm thấy đánh giá nào." />
        )}
      </div>
    </div>
  );
}
