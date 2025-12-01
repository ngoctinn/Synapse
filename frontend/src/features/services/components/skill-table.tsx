"use client";

import { Badge } from "@/shared/ui/badge";
import { AnimatedTableRow } from "@/shared/ui/custom/animated-table-row";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Plus } from "lucide-react";
import { Skill } from "../types";
import { CreateSkillDialog } from "./create-skill-dialog";
import { SkillActions } from "./skill-actions";

interface SkillTableProps {
  skills: Skill[];
}

export function SkillTable({ skills }: SkillTableProps) {
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
      <div className="flex-1 overflow-auto bg-white">
        <Table>
          <TableHeader className="sticky top-0 z-20 bg-white/95 backdrop-blur shadow-sm">
            <TableRow>
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
        </Table>
      </div>
    </div>
  );
}

export function SkillTableSkeleton() {
  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
           <div className="h-8 w-64 bg-slate-100 rounded animate-pulse" />
           <div className="h-8 w-32 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-12 w-full bg-slate-50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
