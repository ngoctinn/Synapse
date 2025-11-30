"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Copy, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createService, deleteService } from "../actions";
import { Service, Skill } from "../types";
import { ServiceForm } from "./service-form";

interface ServiceTableProps {
  services: Service[];
  availableSkills: Skill[];
}

export function ServiceTable({ services, availableSkills }: ServiceTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  const handleDelete = async (id: string) => {
      startTransition(async () => {
        const result = await deleteService(id);
        if (result.success) {
            toast.success("Đã xóa dịch vụ");
            router.refresh();
        } else {
            toast.error(result.message);
        }
      });
  };

  const handleClone = async (service: Service) => {
      startTransition(async () => {
          const cloneData = {
              name: `${service.name} (Sao chép)`,
              duration: service.duration,
              buffer_time: service.buffer_time,
              price: service.price,
              is_active: false, // Clone should be inactive by default
              skill_ids: service.skills.map(s => s.id),
              new_skills: []
          };

          const result = await createService(cloneData);
          if (result.success) {
              toast.success("Đã nhân bản dịch vụ");
              router.refresh();
          } else {
              toast.error(result.message);
          }
      });
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên dịch vụ</TableHead>
            <TableHead className="hidden md:table-cell">Thời lượng</TableHead>
            <TableHead className="hidden md:table-cell">Giá</TableHead>
            <TableHead className="hidden md:table-cell">Kỹ năng yêu cầu</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex flex-col text-xs">
                    <span>Phục vụ: {service.duration}p</span>
                    <span className="text-slate-500">Nghỉ: {service.buffer_time}p</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}</TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex flex-wrap gap-1">
                  {service.skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="text-[10px]">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={service.is_active ? "default" : "secondary"}>
                  {service.is_active ? "Hoạt động" : "Ẩn"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleClone(service)}
                    disabled={isPending}
                    title="Nhân bản"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        setEditingService(service);
                        setOpenEdit(true);
                    }}
                  >
                      <Edit className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Hành động này sẽ ẩn dịch vụ khỏi hệ thống. Bạn không thể hoàn tác.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(service.id)} className="bg-red-500 hover:bg-red-600">
                                Xóa
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Dịch vụ</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin dịch vụ và kỹ năng.
            </DialogDescription>
          </DialogHeader>
          {editingService && (
            <ServiceForm
                initialData={editingService}
                availableSkills={availableSkills}
                onSuccess={() => setOpenEdit(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
