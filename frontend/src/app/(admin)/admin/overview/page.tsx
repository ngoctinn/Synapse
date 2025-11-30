import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Activity, Users } from "lucide-react"

export default function AdminOverviewPage() {
  return (
    <div className="flex flex-col h-full gap-3">
      {/* Stats Grid */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 shrink-0">
        <Card className="relative overflow-hidden rounded-2xl shadow-sm border-none bg-gradient-to-br from-white to-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng Nhân viên
            </CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">24</div>
            <p className="text-sm text-muted-foreground mt-1">Đang hoạt động</p>
            <div className="absolute -right-4 -bottom-4 opacity-[0.05]">
                <Users className="w-24 h-24" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden rounded-2xl shadow-sm border-none bg-gradient-to-br from-white to-purple-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lịch hẹn Hôm nay
            </CardTitle>
            <Activity className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">45</div>
            <p className="text-sm text-muted-foreground mt-1">+12% so với hôm qua</p>
            <div className="absolute -right-4 -bottom-4 opacity-[0.05]">
                <Activity className="w-24 h-24" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden rounded-2xl shadow-sm border-none bg-gradient-to-br from-white to-orange-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dịch vụ Hoạt động
            </CardTitle>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
              Active
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">18</div>
            <p className="text-sm text-muted-foreground mt-1">Danh mục dịch vụ</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden rounded-2xl shadow-sm border-none bg-gradient-to-br from-white to-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Doanh thu Tháng
            </CardTitle>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
              +8%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1.2 tỷ</div>
            <p className="text-sm text-muted-foreground mt-1">VNĐ</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Schedule Section */}
      <div className="grid gap-3 md:grid-cols-7 flex-1 min-h-0">
        {/* Chart (Placeholder) */}
        <Card className="col-span-4 rounded-2xl shadow-sm border-none flex flex-col">
          <CardHeader>
            <CardTitle>Giờ làm việc</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 flex-1 min-h-0">
            <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-xl border border-dashed">
              <p className="text-muted-foreground">Biểu đồ hoạt động</p>
            </div>
          </CardContent>
        </Card>

        {/* Schedule (Placeholder) */}
        <Card className="col-span-3 rounded-2xl shadow-sm border-none flex flex-col overflow-hidden">
          <CardHeader>
            <CardTitle>Lịch trình của bạn</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Tư vấn Tim mạch</p>
                    <p className="text-xs text-muted-foreground">09:00 - 10:00 AM</p>
                  </div>
                  <span className="text-xs font-medium text-green-600">Đã xác nhận</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
