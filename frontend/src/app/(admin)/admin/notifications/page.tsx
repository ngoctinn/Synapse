import { SearchInput } from "@/shared/ui/custom/search-input"
import { FilterButton } from "@/shared/ui/custom/filter-button"

export default function NotificationsPage() {
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-white">
        <div className="flex items-center gap-2 flex-1">
          <SearchInput placeholder="Tìm kiếm thông báo..." />
          <FilterButton />
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
        <p>Tính năng đang được phát triển</p>
      </div>
    </div>
  )
}
