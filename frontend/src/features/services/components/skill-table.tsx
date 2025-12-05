"use client";

import { Badge } from "@/shared/ui/badge";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Skill } from "../types";
import { CreateSkillDialog } from "./create-skill-dialog";
import { SkillActions } from "./skill-actions";

interface SkillTableProps {
  skills: Skill[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  isLoading?: boolean;
}

export function SkillTable({
  skills,
  page = 1,
  totalPages = 1,
  onPageChange,
  className,
  isLoading,
}: SkillTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const columns: Column<Skill>[] = [
    {
      header: "Tên kỹ năng",
      cell: (skill) => (
        <span className="text-lg font-serif text-foreground group-hover:text-primary transition-colors tracking-tight">
          {skill.name}
        </span>
      ),
    },
    {
      header: "Mã kỹ năng",
      cell: (skill) => (
        <Badge variant="outline" className="font-mono text-xs bg-muted/50 text-muted-foreground border-border">
          {skill.code}
        </Badge>
      ),
    },
    {
      header: "Mô tả",
      cell: (skill) => (
        <span className="text-muted-foreground max-w-md truncate block">
          {skill.description || "-"}
        </span>
      ),
    },
    {
      header: "Thao tác",
      cell: (skill) => <SkillActions skill={skill} />,
    },
  ];

  return (
    <DataTable
      data={skills}
      columns={columns}
      keyExtractor={(skill) => skill.id}
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      className={className}
      isLoading={isLoading}
      skeletonCount={5}
      emptyState={
        <DataTableEmptyState
          icon={Plus}
          title="Chưa có kỹ năng nào"
          description="Tạo kỹ năng mới để gán cho dịch vụ và nhân viên."
          action={<CreateSkillDialog />}
        />
      }
    />
  );
}

import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton";

export function SkillTableSkeleton() {
  return (
    <DataTableSkeleton
      columnCount={4}
      rowCount={5}
      searchable={false}
      filterable={false}
    />
  );
}
