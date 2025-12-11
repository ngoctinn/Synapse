
import { cn } from "@/shared/lib/utils"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Crown, Save, UserPlus } from "lucide-react"
import * as React from "react"
import { useForm } from "react-hook-form"

import { manageCustomer } from "@/features/customers/actions"
import {
    CustomerFormValues,
    customerSchema,
    CustomerUpdateFormValues,
    customerUpdateSchema
} from "@/features/customers/model/schemas"
import { Customer } from "@/features/customers/model/types"
import { getTechnicians, type TechnicianOption } from "@/features/staff/actions"


import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { showToast } from "@/shared/ui/custom/sonner"
import { Form } from "@/shared/ui/form"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle
} from "@/shared/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { getFormTabsGridCols, SHEET_TABS_LIST_CLASS, SHEET_TABS_TRIGGER_CLASS } from "@/shared/ui/tabs-styles"
import { CustomerForm } from "./customer-form"
import { CustomerHistory } from "./customer-history"

interface CustomerSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "update"
  customer?: Customer
}

const initialState = {
    success: false,
    message: "",
    error: "",
}



export function CustomerSheet({ open, onOpenChange, mode, customer }: CustomerSheetProps) {
  const [state, dispatch, isPending] = React.useActionState(manageCustomer, initialState)
  const [technicians, setTechnicians] = React.useState<TechnicianOption[]>([])

  const schema = mode === "create" ? customerSchema : customerUpdateSchema

  // Fetch danh sách kỹ thuật viên cho dropdown "Chuyên viên ưu tiên"
  React.useEffect(() => {
    if (open) {
      getTechnicians().then(setTechnicians)
    }
  }, [open])


  const form = useForm<CustomerFormValues | CustomerUpdateFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      gender: undefined,
      date_of_birth: "",
      address: "",
      membership_tier: "SILVER",
      loyalty_points: 0,
    },
  })

  React.useEffect(() => {
    if (state.success && state.message) {
      showToast.success(mode === "create" ? "Tạo thành công" : "Cập nhật thành công", state.message)
      onOpenChange(false)
    } else if (state.error) {
      showToast.error("Thất bại", state.error)
    }
  }, [state, mode, onOpenChange])

  React.useEffect(() => {
    if (open) {
      if (mode === "update" && customer) {
          form.reset({
              id: customer.id,
              full_name: customer.full_name,
              email: customer.email || "",
              phone_number: customer.phone_number || "",
              gender: customer.gender || undefined,
              date_of_birth: customer.date_of_birth || "",
              address: customer.address || "",
              allergies: customer.allergies || "",
              medical_notes: customer.medical_notes || "",
              membership_tier: customer.membership_tier || "SILVER",
              loyalty_points: customer.loyalty_points || 0,
              preferred_staff_id: customer.preferred_staff_id || undefined,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any)
      } else {
           form.reset({
              full_name: "",
              email: "",
              phone_number: "",
              gender: undefined,
              date_of_birth: "",
              address: "",
              allergies: "",
              medical_notes: "",
              membership_tier: "SILVER",
              loyalty_points: 0,
           })
      }
    }
  }, [open, mode, customer, form])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    const formData = new FormData()
    formData.append("form_mode", mode)
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string)
      }
    })

    React.startTransition(() => {
        dispatch(formData)
    })
  }



  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={cn(
          "w-full p-0 gap-0 flex flex-col bg-background border-l shadow-2xl transition-all duration-300",
          mode === "update" ? "sm:max-w-3xl" : "sm:max-w-xl"
      )}>
        <SheetHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
                <SheetTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
                    {mode === "create" ? "Thêm khách hàng mới" : "Hồ sơ khách hàng"}

                    {mode === "update" && customer?.allergies && (
                        <Badge variant="destructive" className="gap-1.5 h-6 animate-in zoom-in-50">
                             <AlertCircle className="size-3.5" />
                             Dị ứng
                        </Badge>
                    )}

                    {mode === "update" && customer?.membership_tier === "GOLD" && (
                        <Badge variant="warning" className="gap-1.5 h-6">
                             <Crown className="size-3.5" />
                             Gold
                        </Badge>
                    )}
                 </SheetTitle>
            </div>
            <SheetDescription className="text-muted-foreground text-sm">
                {mode === "create"
                    ? "Tạo hồ sơ khách hàng mới để bắt đầu đặt lịch và theo dõi liệu trình."
                    : "Quản lý thông tin cá nhân và hồ sơ sức khỏe."}
            </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6" id="sheet-scroll-container">
            <Form {...form}>
                <form id="customer-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {mode === "create" ? (
                         <CustomerForm mode={mode} disabled={isPending} technicians={technicians} />
                    ) : (
                        <Tabs defaultValue="info" className="w-full">
                            <TabsList className={`${SHEET_TABS_LIST_CLASS} ${getFormTabsGridCols(2)}`}>
                                <TabsTrigger value="info" className={SHEET_TABS_TRIGGER_CLASS}>Thông tin</TabsTrigger>
                                <TabsTrigger value="history" className={SHEET_TABS_TRIGGER_CLASS}>Lịch sử & Thống kê</TabsTrigger>
                            </TabsList>
                            <TabsContent value="info" className="mt-0 space-y-6">
                                <CustomerForm mode={mode} disabled={isPending} technicians={technicians} />
                            </TabsContent>
                            <TabsContent value="history" className="mt-0">
                                <CustomerHistory />
                            </TabsContent>
                        </Tabs>
                    )}
                </form>
            </Form>
        </div>

        <SheetFooter className="px-6 py-4 border-t sm:justify-between flex-row items-center gap-4 bg-background z-20">
            <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="text-muted-foreground hover:text-foreground"
            >
                Hủy bỏ
            </Button>
            {/* Display save button only if not in History tab? Actually we can keep it, but it submits the form.
                If user is in History tab, they might still want to save form changes.
                However, to avoid confusion, maybe we should only show specific actions.
                For now, keep simple: Save always saves the Info form.
            */}
            <Button
                type="submit"
                form="customer-form"
                disabled={isPending}
                className="min-w-[140px]"
                isLoading={isPending}
            >
                {mode === "create" ? (
                    <>
                        <UserPlus className="mr-2 h-4 w-4" /> Tạo hồ sơ
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
                    </>
                )}
            </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
