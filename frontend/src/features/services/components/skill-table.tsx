"use client";

import { Badge } from "@/shared/ui/badge";
import { AnimatedTableRow } from "@/shared/ui/custom/animated-table-row";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { PaginationControls } from "@/shared/ui/custom/pagination-controls";
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
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
      <div className="flex-1 overflow-auto bg-card border rounded-lg relative shadow-sm">
        <table className="w-full caption-bottom text-sm min-w-[800px]">
          <TableHeader className="sticky top-0 z-20 bg-card shadow-sm after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-border">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="bg-card pl-6 h-12 font-medium text-muted-foreground">Tên kỹ năng</TableHead>
              <TableHead className="bg-card h-12 font-medium text-muted-foreground">Mã kỹ năng</TableHead>
              <TableHead className="bg-card h-12 font-medium text-muted-foreground">Mô tả</TableHead>
              <TableHead className="text-right bg-card pr-6 h-12 font-medium text-muted-foreground">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.map((skill, index) => (
              <AnimatedTableRow key={skill.id} index={index} className="group hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0">
                <TableCell className="font-medium pl-6 py-4">
                  <span className="text-base font-serif text-foreground group-hover:text-primary transition-colors">{skill.name}</span>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="outline" className="font-mono text-xs bg-muted/50 text-muted-foreground border-border">
                    {skill.code}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground max-w-md truncate py-4">
                  {skill.description || "-"}
                </TableCell>
                <TableCell className="text-right pr-6 py-4">
                  <SkillActions skill={skill} />
                </TableCell>
              </AnimatedTableRow>
            ))}
          </TableBody>
        </table>
      </div>
      <div className="px-1">
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
