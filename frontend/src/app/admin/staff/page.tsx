import {
  StaffPage,
  getPermissions,
  getSchedules,
  getSkills,
  getStaffList,
} from "@/features/staff";
import { getCurrentUserRole } from "@/shared/lib/supabase/server";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const pageNumber = Number(page) || 1;

  const today = new Date();
  const start = format(startOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd");
  const end = format(endOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd");

  // Lấy role để kiểm tra quyền hiển thị nút tạo nhân viên
  const [skillsRes, permissionsRes, schedulesRes, userRole] = await Promise.all(
    [
      getSkills(),
      getPermissions(),
      getSchedules(start, end),
      getCurrentUserRole(),
    ]
  );

  const skills = skillsRes.status === "success" ? skillsRes.data || [] : [];
  const permissions =
    permissionsRes.status === "success" ? permissionsRes.data || {} : {};
  const schedules =
    schedulesRes.status === "success" ? schedulesRes.data || [] : [];

  // Chỉ Manager mới được tạo nhân viên
  const canManageStaff = userRole === "manager";

  // Truyền Promise để Suspense hiển thị skeleton
  const staffListPromise = getStaffList(pageNumber);

  return (
    <Suspense fallback={<div>Đang tải nhân viên...</div>}>
      <StaffPage
        page={pageNumber}
        skills={skills}
        staffListPromise={staffListPromise}
        initialPermissions={permissions}
        initialSchedules={schedules}
        canManageStaff={canManageStaff}
      />
    </Suspense>
  );
}

