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
import { StaffActions } from "./staff-actions"

import { ROLE_CONFIG } from "../../constants"

const roleConfig = ROLE_CONFIG


export function StaffTable() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.1)]">
            <TableRow className="hover:bg-transparent border-b-0">
              <TableHead className="w-[250px] pl-6">Nhân viên</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Kỹ năng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right pr-6">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_STAFF.map((staff) => (
              <TableRow key={staff.id} className="hover:bg-muted/5">
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={staff.avatarUrl} alt={staff.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">{staff.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{staff.name}</span>
                      <span className="text-xs text-muted-foreground">{staff.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={roleConfig[staff.role].variant} className="rounded-md px-2.5 py-0.5 font-medium">
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
                <TableCell className="text-right pr-6">
                  <StaffActions staff={staff} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
