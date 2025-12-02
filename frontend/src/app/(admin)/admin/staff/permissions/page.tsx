import { PermissionMatrix } from "@/features/staff"
import { SearchInput } from "@/shared/ui/custom/search-input"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Phân quyền nhân sự | Synapse",
  description: "Quản lý quyền hạn của nhân viên",
}

export default function StaffPermissionsPage() {
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-white">
        <div className="flex items-center gap-2 flex-1">
          <SearchInput placeholder="Tìm kiếm phân quyền..." />
        </div>
      </div>
      <div className="flex-1 overflow-hidden p-0">
        <PermissionMatrix />
      </div>
    </div>
  )
}
