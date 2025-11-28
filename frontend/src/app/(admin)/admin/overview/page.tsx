import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Activity, Users } from "lucide-react"

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl shadow-sm border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng Nhân viên
            </CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">24</div>
            <p className="text-xs text-muted-foreground mt-1">Đang hoạt động</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lịch hẹn Hôm nay
            </CardTitle>
            <Activity className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">45</div>
            <p className="text-xs text-muted-foreground mt-1">+12% so với hôm qua</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-none">
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
            <p className="text-xs text-muted-foreground mt-1">Danh mục dịch vụ</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Doanh thu Tháng
            </CardTitle>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
              +8%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">1.2 tỷ</div>
            <p className="text-xs text-muted-foreground mt-1">VNĐ</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Schedule Section */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Chart (Placeholder) */}
        <Card className="col-span-4 rounded-2xl shadow-sm border-none">
          <CardHeader>
            <CardTitle>Giờ làm việc</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-xl border border-dashed">
              <p className="text-muted-foreground">Biểu đồ hoạt động</p>
            </div>
          </CardContent>
        </Card>

        {/* Schedule (Placeholder) */}
        <Card className="col-span-3 rounded-2xl shadow-sm border-none">
          <CardHeader>
            <CardTitle>Lịch trình của bạn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
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
