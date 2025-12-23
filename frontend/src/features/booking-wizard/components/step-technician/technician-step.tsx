import { Loader2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { getAvailableStaff } from "../../actions";
import { useBookingStore } from "../../hooks/use-booking-store";
import { StaffItem } from "../../types";
import { StaffList } from "./staff-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

export const TechnicianStep = () => {
  const {
    staffId,
    staffName,
    setStaff,
    selectedServices,
    selectedSlot
  } = useBookingStore();

  const [isLoading, setIsLoading] = useState(false);
  const [altStaff, setAltStaff] = useState<StaffItem[]>([]);

  // In this new flow, staff is already selected via TimeSlot in TimeStep.
  // This step can be used to show details or allow switching to other staff
  // available at the SAME time if the user changed their mind.

  useEffect(() => {
    if (!selectedSlot) return;

    const fetchAltStaff = async () => {
      setIsLoading(true);
      // Logic could be: find all staff available at selectedSlot.start_time
      const res = await getAvailableStaff({
        serviceIds: selectedServices.map(s => s.id),
        date: new Date(selectedSlot.date)
      });

      if (res.status === "success" && res.data) {
        setAltStaff(res.data);
      }
      setIsLoading(false);
    };

    fetchAltStaff();
  }, [selectedSlot, selectedServices]);

  const handleSelectStaff = (staff: StaffItem) => {
    setStaff(staff.id, staff.name);
  };

  if (!selectedSlot) {
    return (
      <div className="text-center py-20">
        <p>Vui lòng chọn thời gian ở bước trước.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-bold tracking-tight">Xác nhận chuyên viên</h2>
        <p className="text-muted-foreground mt-1">
          Đây là chuyên viên sẽ thực hiện liệu trình cho bạn vào lúc {selectedSlot.start_time}
        </p>
      </div>

      {/* Selected Staff Detail Card */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <Avatar className="size-24 border-4 border-primary/10">
          <AvatarImage src={undefined} />
          <AvatarFallback className="bg-primary/5 text-primary">
            <User className="size-12" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <h3 className="text-xl font-bold">{staffName || "Chuyên viên"}</h3>
          <p className="text-primary font-medium">Kỹ thuật viên chuyên nghiệp</p>
          <div className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
            <span>⭐ 5.0</span>
            <span className="mx-2">•</span>
            <span>Đã thực hiện 500+ lượt khách</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-primary" />
        </div>
      ) : altStaff.length > 1 && (
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
            Các chuyên viên khác cũng rảnh giờ này
          </h4>
          <StaffList
            staff={altStaff.filter(s => s.id !== staffId)}
            selectedStaffId={null}
            onSelect={handleSelectStaff}
          />
        </div>
      )}
    </div>
  );
};
