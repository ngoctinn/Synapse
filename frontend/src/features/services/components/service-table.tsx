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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table";
import { Copy, Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { cloneService, deleteService } from "../actions";
import { Service, Skill } from "../types";
import { CreateServiceDialog } from "./create-service-dialog";
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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deletingId) return;

    startTransition(async () => {
      const result = await deleteService(deletingId);
      if (result.success) {
        toast.success("Đã xóa dịch vụ");
        router.refresh();
      } else {
        toast.error(result.message);
      }
      setDeletingId(null);
    });
  };

  const handleClone = async (id: string) => {
    startTransition(async () => {
      const result = await cloneService(id);
      if (result.success) {
        toast.success("Đã nhân bản dịch vụ");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md bg-slate-50/50 dashed border-slate-200">
        <div className="p-4 rounded-full bg-slate-100 mb-4">
          <Plus className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">Chưa có dịch vụ nào</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-1 mb-4">
          Bắt đầu bằng cách tạo dịch vụ đầu tiên của bạn. Dịch vụ sẽ hiển thị trên trang đặt lịch.
        </p>
        <CreateServiceDialog availableSkills={availableSkills} />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <div className="max-h-[calc(100vh-220px)] overflow-y-auto relative">
          <Table>
            <TableHeader className="sticky top-0 z-20 bg-white shadow-sm">
              <TableRow>
                <TableHead className="bg-white">Tên dịch vụ</TableHead>
                <TableHead className="hidden md:table-cell bg-white">Thời lượng</TableHead>
                <TableHead className="hidden md:table-cell bg-white">Giá</TableHead>
                <TableHead className="hidden md:table-cell bg-white">Kỹ năng yêu cầu</TableHead>
                <TableHead className="bg-white">Trạng thái</TableHead>
                <TableHead className="text-right bg-white">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{service.name}</span>
                    <span className="md:hidden text-xs text-slate-500">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col text-xs">
                    <span className="font-medium">Phục vụ: {service.duration}p</span>
                    <span className="text-slate-500">Nghỉ: {service.buffer_time}p</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell font-medium text-slate-700">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {service.skills.map((skill) => (
                      <Badge key={skill.id} variant="secondary" className="text-[10px] px-1.5 py-0">
                        {skill.name}
                      </Badge>
                    ))}
                    {service.skills.length === 0 && (
                      <span className="text-xs text-slate-400 italic">Không yêu cầu</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={service.is_active ? "default" : "secondary"} className={service.is_active ? "bg-green-500 hover:bg-green-600" : ""}>
                    {service.is_active ? "Hoạt động" : "Ẩn"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleClone(service.id)}
                        disabled={isPending}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Nhân bản</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingService(service);
                          setOpenEdit(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Chỉnh sửa</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeletingId(service.id)}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Xóa dịch vụ</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      </div>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
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

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa dịch vụ khỏi hệ thống. Bạn không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
              disabled={isPending}
            >
              {isPending ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
export function ServiceTableSkeleton() {
  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
           <div className="h-8 w-64 bg-slate-100 rounded animate-pulse" />
           <div className="h-8 w-32 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-12 w-full bg-slate-50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
