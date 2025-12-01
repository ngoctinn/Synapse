"use client";

import { Badge } from "@/shared/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table";
import { motion } from "framer-motion";
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
      <div className="flex flex-col items-center justify-center py-16 text-center border rounded-xl bg-white/50 backdrop-blur-sm border-dashed border-slate-300">
        <div className="p-4 rounded-full bg-blue-50 mb-4 animate-in zoom-in duration-500">
          <Plus className="w-10 h-10 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900">Chưa có kỹ năng nào</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-2 mb-6">
          Tạo kỹ năng mới để gán cho dịch vụ và nhân viên.
        </p>
        <CreateSkillDialog />
      </div>
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
              <motion.tr
                key={skill.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="hover:bg-blue-50/50 transition-colors border-b last:border-0"
              >
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
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
