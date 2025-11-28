"use client"

import { Badge } from "@/shared/ui/badge"
import { Checkbox } from "@/shared/ui/checkbox"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table"
import { useState } from "react"
import { BulkSaveBar } from "./bulk-save-bar"

// Mock Modules
const MODULES = [
  { id: "dashboard", name: "Dashboard" },
  { id: "staff", name: "Quản lý Nhân viên" },
  { id: "customers", name: "Quản lý Khách hàng" },
  { id: "services", name: "Quản lý Dịch vụ" },
  { id: "inventory", name: "Kho & Sản phẩm" },
  { id: "reports", name: "Báo cáo & Thống kê" },
  { id: "settings", name: "Cấu hình Hệ thống" },
]

const ROLES = [
  { id: "ADMIN", name: "Quản trị viên", variant: "destructive" },
  { id: "RECEPTIONIST", name: "Lễ tân", variant: "default" },
  { id: "TECHNICIAN", name: "Kỹ thuật viên", variant: "secondary" },
] as const

// Mock Initial Permissions (Module ID -> Role ID -> boolean)
const INITIAL_PERMISSIONS: Record<string, Record<string, boolean>> = {
  dashboard: { ADMIN: true, RECEPTIONIST: true, TECHNICIAN: true },
  staff: { ADMIN: true, RECEPTIONIST: false, TECHNICIAN: false },
  customers: { ADMIN: true, RECEPTIONIST: true, TECHNICIAN: false },
  services: { ADMIN: true, RECEPTIONIST: false, TECHNICIAN: false },
  inventory: { ADMIN: true, RECEPTIONIST: true, TECHNICIAN: false },
  reports: { ADMIN: true, RECEPTIONIST: false, TECHNICIAN: false },
  settings: { ADMIN: true, RECEPTIONIST: false, TECHNICIAN: false },
}

export function PermissionMatrix() {
  const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS)
  const [hasChanges, setHasChanges] = useState(false)
  const [changeCount, setChangeCount] = useState(0)

  const handleToggle = (moduleId: string, roleId: string) => {
    setPermissions((prev) => {
      const modulePerms = prev[moduleId]
      const newPerms = {
        ...prev,
        [moduleId]: {
          ...modulePerms,
          [roleId]: !modulePerms[roleId],
        },
      }
      return newPerms
    })
    setHasChanges(true)
    setChangeCount((prev) => prev + 1)
  }

  const handleSave = () => {
    // TODO: Call API to save permissions
    console.log("Saving permissions:", permissions)
    setHasChanges(false)
    setChangeCount(0)
  }

  const handleReset = () => {
    setPermissions(INITIAL_PERMISSIONS)
    setHasChanges(false)
    setChangeCount(0)
  }

  return (
    <div className="relative space-y-4">
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Chức năng (Module)</TableHead>
              {ROLES.map((role) => (
                <TableHead key={role.id} className="text-center">
                  <Badge variant={role.variant}>{role.name}</Badge>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {MODULES.map((module) => (
              <TableRow key={module.id}>
                <TableCell className="font-medium">{module.name}</TableCell>
                {ROLES.map((role) => (
                  <TableCell key={role.id} className="text-center">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={permissions[module.id]?.[role.id] || false}
                        onCheckedChange={() => handleToggle(module.id, role.id)}
                        disabled={role.id === "ADMIN"} // Admin always has full access usually
                      />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <BulkSaveBar
        open={hasChanges}
        changeCount={changeCount}
        onSave={handleSave}
        onReset={handleReset}
      />
    </div>
  )
}
