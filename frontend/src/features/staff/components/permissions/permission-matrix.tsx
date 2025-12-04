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
import { Lock } from "lucide-react"
import { useState } from "react"
import { MODULES, ROLES } from "../../constants"
import { BulkSaveBar } from "./bulk-save-bar"

// Mock Initial Permissions (Module ID -> Role ID -> boolean)
const INITIAL_PERMISSIONS: Record<string, Record<string, boolean>> = {
  dashboard: { admin: true, receptionist: true, technician: true },
  staff: { admin: true, receptionist: false, technician: false },
  customers: { admin: true, receptionist: true, technician: false },
  services: { admin: true, receptionist: false, technician: false },
  inventory: { admin: true, receptionist: true, technician: false },
  reports: { admin: true, receptionist: false, technician: false },
  settings: { admin: true, receptionist: false, technician: false },
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
    <div className="h-full flex flex-col relative">
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.1)]">
            <TableRow className="hover:bg-transparent border-b-0">
              <TableHead className="w-[250px] font-semibold pl-6 bg-white">Chức năng (Module)</TableHead>
              {ROLES.map((role) => (
                <TableHead key={role.id} className="text-center h-12 bg-white">
                  <Badge variant={role.variant} className="rounded-md px-3 py-1">
                    {role.name}
                  </Badge>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {MODULES.map((module) => (
              <TableRow key={module.id} className="hover:bg-muted/5 transition-colors">
                <TableCell className="font-medium pl-6 py-4">{module.name}</TableCell>
                {ROLES.map((role) => {
                  const isDisabled = role.id === "admin"
                  return (
                    <TableCell key={role.id} className="text-center p-0">
                      <div className="flex justify-center items-center h-full w-full py-2">
                        {isDisabled ? (
                          <div className="h-8 w-8 flex items-center justify-center text-muted-foreground/30 bg-muted/10 rounded-md">
                            <Lock className="h-4 w-4" />
                          </div>
                        ) : (
                          <Checkbox
                            checked={permissions[module.id]?.[role.id] || false}
                            onCheckedChange={() => handleToggle(module.id, role.id)}
                            className="h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          />
                        )}
                      </div>
                    </TableCell>
                  )
                })}
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
