import { StaffPage } from "@/features/staff"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quản lý nhân sự | Synapse",
  description: "Quản lý nhân viên, phân quyền và lịch làm việc",
}

export default function Page() {
  return <StaffPage />
}
