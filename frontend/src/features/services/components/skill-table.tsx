"use client";

import { Badge } from "@/shared/ui/badge";
import { AnimatedTableRow } from "@/shared/ui/custom/animated-table-row";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { PaginationControls } from "@/shared/ui/custom/pagination-controls";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
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
}

export function SkillTable({
  skills,
  page = 1,
  totalPages = 1,
  onPageChange,
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

  if (skills.length === 0) {
    return (
      <DataTableEmptyState
        icon={Plus}
        title="Chưa có kỹ năng nào"
        description="Tạo kỹ năng mới để gán cho dịch vụ và nhân viên."
        action={<CreateSkillDialog />}
      />
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-1 overflow-auto bg-white border relative">
        <table className="w-full caption-bottom text-sm min-w-[800px]">
          <TableHeader className="sticky top-0 z-20 bg-white shadow-sm">
            <TableRow className="hover:bg-transparent border-b-0">
              <TableHead className="bg-white pl-6">Tên kỹ năng</TableHead>
              <TableHead className="bg-white">Mã kỹ năng</TableHead>
              <TableHead className="bg-white">Mô tả</TableHead>
              <TableHead className="text-right bg-white pr-6">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.map((skill, index) => (
              <AnimatedTableRow key={skill.id} index={index}>
                <TableCell className="font-medium pl-6">
                  {skill.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-xs">
                    {skill.code}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500 max-w-md truncate">
                  {skill.description || "-"}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <SkillActions skill={skill} />
                </TableCell>
              </AnimatedTableRow>
            ))}
          </TableBody>
        </table>
      </div>
      <div className="px-4 pb-4">
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
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
