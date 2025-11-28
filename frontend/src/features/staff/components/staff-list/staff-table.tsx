"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Badge } from "@/shared/ui/badge"
import { Switch } from "@/shared/ui/switch"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/shared/ui/tooltip"
import { MOCK_STAFF } from "../../data/mock-staff"
import { Role } from "../../types"
import { StaffActions } from "./staff-actions"

const roleConfig: Record<Role, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  ADMIN: { label: "Quản trị viên", variant: "destructive" },
  RECEPTIONIST: { label: "Lễ tân", variant: "default" }, // Blue default
  TECHNICIAN: { label: "Kỹ thuật viên", variant: "secondary" }, // Purple secondary
}

export function StaffTable() {
  return (
    <div className="rounded-md border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Nhân viên</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Kỹ năng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_STAFF.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={staff.avatarUrl} alt={staff.name} />
                    <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{staff.name}</span>
                    <span className="text-xs text-muted-foreground">{staff.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={roleConfig[staff.role].variant}>
                  {roleConfig[staff.role].label}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {staff.skills.length > 0 ? (
                    <>
                      {staff.skills.slice(0, 2).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs font-normal">
                          {skill}
                        </Badge>
                      ))}
                      {staff.skills.length > 2 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="text-xs font-normal cursor-help">
                                +{staff.skills.length - 2} more
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="flex flex-col gap-1">
                                {staff.skills.slice(2).map((skill) => (
                                  <span key={skill}>{skill}</span>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">--</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Switch checked={staff.isActive} />
              </TableCell>
              <TableCell className="text-right">
                <StaffActions staff={staff} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
