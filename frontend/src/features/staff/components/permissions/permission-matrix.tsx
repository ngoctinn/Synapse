"use client";

import { Badge } from "@/shared/ui/badge";
import { Checkbox } from "@/shared/ui/checkbox";
import { AnimatedTableRow } from "@/shared/ui/custom/animated-table-row";
import { VStack } from "@/shared/ui/layout/stack";
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updatePermissions } from "../../actions";
import { MODULES, ROLES } from "../../model/constants";
import { BulkSaveBar } from "./bulk-save-bar";

interface PermissionMatrixProps {
  initialPermissions: Record<string, Record<string, boolean>>;
  className?: string;
}

export function PermissionMatrix({
  initialPermissions,
  className,
}: PermissionMatrixProps) {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [hasChanges, setHasChanges] = useState(false);
  const [changeCount, setChangeCount] = useState(0);
  const [, startTransition] = useTransition();

  const handleToggle = (moduleId: string, roleId: string) => {
    setPermissions((prev) => {
      const modulePerms = prev[moduleId];
      const newPerms = {
        ...prev,
        [moduleId]: {
          ...modulePerms,
          [roleId]: !modulePerms[roleId],
        },
      };
      return newPerms;
    });
    setHasChanges(true);
    setChangeCount((prev) => prev + 1);
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await updatePermissions(permissions);
      if (result.status === "success") {
        toast.success(result.message);
        setHasChanges(false);
        setChangeCount(0);
      } else {
        toast.error(result.message || "Lỗi cập nhật phân quyền");
      }
    });
  };

  const handleReset = () => {
    setPermissions(initialPermissions);
    setHasChanges(false);
    setChangeCount(0);
  };

  return (
    <VStack className={`relative ${className}`}>
      <div className="">
        <div className="relative w-full">
          <table className="w-full caption-bottom text-sm">
            {/* Sticky Header fixed top-0 because it's inside a relative container or we trust the container scroll */}
            <TableHeader className="bg-background sticky top-0 z-30 shadow-sm">
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableHead className="bg-background w-64 pl-8 font-semibold">
                  Chức năng (Module)
                </TableHead>
                {ROLES.map((role) => (
                  <TableHead
                    key={role.id}
                    className="bg-background h-12 text-center"
                  >
                    <Badge variant={role.variant} size="sm">
                      {role.name}
                    </Badge>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {MODULES.map((module, index) => (
                <AnimatedTableRow
                  key={module.id}
                  index={index}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <TableCell className="py-4 pl-8 font-medium">
                    {module.name}
                  </TableCell>
                  {ROLES.map((role) => {
                    return (
                      <TableCell
                        key={role.id}
                        className="hover:bg-muted/10 cursor-pointer p-0 text-center transition-colors"
                        onClick={() => handleToggle(module.id, role.id)}
                      >
                        <div className="flex h-full w-full items-center justify-center py-2">
                          <Checkbox
                            checked={
                              permissions[module.id]?.[role.id] || false
                            }
                            onCheckedChange={() =>
                              handleToggle(module.id, role.id)
                            }
                            className="permission-checkbox"
                            aria-label={`Toggle ${module.name} for ${role.name}`}
                          />
                        </div>
                      </TableCell>
                    );
                  })}
                </AnimatedTableRow>
              ))}
            </TableBody>
          </table>
        </div>
      </div>

      <BulkSaveBar
        open={hasChanges}
        changeCount={changeCount}
        onSave={handleSave}
        onReset={handleReset}
      />
    </VStack>
  );
}
