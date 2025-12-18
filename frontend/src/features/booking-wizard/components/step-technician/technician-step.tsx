import { useEffect, useState } from "react";
import { useBookingStore } from "../../hooks/use-booking-store";
import { getAvailableStaff } from "../../actions";
import { StaffItem } from "../../types";
import { AnyOption } from "./any-option";
import { StaffList } from "./staff-list";
import { Loader2 } from "lucide-react";

export const TechnicianStep = () => {
  const {
    staffId,
    setStaff,
    selectedServices
  } = useBookingStore();

  const [isLoading, setIsLoading] = useState(true);
  const [staff, setStaffData] = useState<StaffItem[]>([]);

  useEffect(() => {
    const fetchStaff = async () => {
      setIsLoading(true);
      // Pass selected services to filter staff
      const serviceIds = selectedServices.map(s => s.id);
      const res = await getAvailableStaff({ serviceIds });

      if (res.status === "success" && res.data) {
        setStaffData(res.data);
      }
      setIsLoading(false);
    };

    fetchStaff();
  }, [selectedServices]);

  const handleSelectStaff = (staff: StaffItem | 'any') => {
    if (staff === 'any') {
      setStaff('any', 'Ngẫu nhiên');
    } else {
      setStaff(staff.id, staff.name);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Chọn Kỹ thuật viên</h2>
        <p className="text-muted-foreground mt-1">
          Vui lòng chọn KTV bạn muốn thực hiện dịch vụ
        </p>
      </div>

      <AnyOption
        isSelected={staffId === 'any'}
        onSelect={() => handleSelectStaff('any')}
      />

      <StaffList
        staff={staff}
        selectedStaffId={staffId === 'any' ? null : staffId}
        onSelect={handleSelectStaff}
      />
    </div>
  );
};
