import { getCustomerTreatments, TreatmentList } from "@/features/customer-dashboard"
import { Separator } from "@/shared/ui/separator"

export default async function TreatmentsPage() {
  const treatments = await getCustomerTreatments()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Liệu trình của tôi</h3>
        <p className="text-sm text-muted-foreground">
          Theo dõi tiến độ sử dụng các gói dịch vụ và liệu trình đã mua.
        </p>
      </div>
      <Separator />
      <TreatmentList treatments={treatments} />
    </div>
  )
}
