"use client"

import { Badge } from "@/shared/ui/badge"
import { Checkbox } from "@/shared/ui/checkbox"
import { AnimatedTableRow } from "@/shared/ui/custom/animated-table-row"
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/shared/ui/table"
import { Lock } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { updatePermissions } from "../../actions"
import { MODULES, ROLES } from "../../constants"
import { BulkSaveBar } from "./bulk-save-bar"

interface PermissionMatrixProps {
  initialPermissions: Record<string, Record<string, boolean>>
  className?: string
}

export function PermissionMatrix({ initialPermissions, className }: PermissionMatrixProps) {
  const [permissions, setPermissions] = useState(initialPermissions)
  const [hasChanges, setHasChanges] = useState(false)
  const [changeCount, setChangeCount] = useState(0)
  const [isPending, startTransition] = useTransition()

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
    startTransition(async () => {
      const result = await updatePermissions(permissions)
      if (result.success) {
        toast.success(result.message)
        setHasChanges(false)
        setChangeCount(0)
      } else {
        toast.error(result.error)
      }
    })
  }

  const handleReset = () => {
    setPermissions(initialPermissions)
    setHasChanges(false)
    setChangeCount(0)
  }

  return (
    <div className={`flex flex-col relative ${className}`}>
      <div className="">
        <div className="relative w-full">
          <table className="w-full caption-bottom text-sm">
            <TableHeader className="sticky top-[var(--header-height-mobile,109px)] md:top-[var(--header-height,57px)] z-10 bg-background shadow-[0_1px_0_0_rgba(0,0,0,0.1)]">
              <TableRow className="hover:bg-transparent border-b-0">
                <TableHead className="w-[250px] font-semibold pl-8 bg-background">Chức năng (Module)</TableHead>
                {ROLES.map((role) => (
                  <TableHead key={role.id} className="text-center h-12 bg-background">
                    <Badge variant={role.variant} className="rounded-md px-3 py-1">
                      {role.name}
                    </Badge>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {MODULES.map((module, index) => (
                <AnimatedTableRow key={module.id} index={index} className="hover:bg-muted/5 transition-colors">
                  <TableCell className="font-medium pl-8 py-4">{module.name}</TableCell>
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
    </div>
  )
}
