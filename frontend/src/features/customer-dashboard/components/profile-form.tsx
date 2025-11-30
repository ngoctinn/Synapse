"use client"

import { updateProfile } from "@/features/customer-dashboard/actions"
import { UserProfile } from "@/features/customer-dashboard/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"
import { BirthdayPicker } from "@/shared/ui/custom/birthday-picker"
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon"
import { showToast } from "@/shared/ui/custom/sonner"
import { Label } from "@/shared/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip"
import { motion } from "framer-motion"
import { Cake, Camera, Loader2, Lock, MapPin, Phone, User } from "lucide-react"
import { useActionState, useEffect, useState } from "react"
import { AvatarSelector } from "./avatar-selector"

interface ProfileFormProps {
  user: UserProfile
}

const initialState = {
  message: '',
  success: false,
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState)
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user.avatarUrl)
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
    user.dateOfBirth ? new Date(user.dateOfBirth) : undefined
  )

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        showToast.success("Thành công", state.message)
      } else {
        showToast.error("Lỗi", state.message)
      }
    }
  }, [state])

  const handleAvatarSelect = (url: string) => {
    setAvatarUrl(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form action={formAction}>
        <input type="hidden" name="avatarUrl" value={avatarUrl || ''} />
        {dateOfBirth && (
          <input
            type="hidden"
            name="dateOfBirth"
            value={dateOfBirth.toISOString().split('T')[0]}
          />
        )}

        <Card className="overflow-hidden border-none shadow-lg">
          <CardHeader className="bg-muted/30 pb-8">
            <CardTitle className="text-2xl font-bold text-primary">Thông tin cá nhân</CardTitle>
            <CardDescription className="text-base">
              Cập nhật thông tin liên hệ và ảnh đại diện của bạn.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Cột Trái: Avatar */}
              <div className="flex flex-col items-center space-y-6 lg:w-1/3 lg:border-r lg:pr-10">
                <div className="relative">
                  <AvatarSelector
                    currentAvatar={avatarUrl}
                    onSelect={handleAvatarSelect}
                    trigger={
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative group cursor-pointer"
                      >
                        <Avatar className="h-40 w-40 border-4 border-background shadow-2xl ring-4 ring-muted/50 transition-all duration-300 group-hover:ring-primary/20">
                          <AvatarImage src={avatarUrl} alt={user.fullName} className="object-cover" />
                          <AvatarFallback className="text-5xl bg-primary/5 text-primary font-bold">
                            {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors ring-2 ring-background">
                          <Camera className="h-5 w-5" />
                        </div>
                      </motion.div>
                    }
                  />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="font-bold text-xl text-foreground">{user.fullName}</h3>
                  <p className="text-sm text-muted-foreground font-medium">{user.email}</p>
                  <div className="pt-2">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                      Thành viên {user.membershipTier || 'Bạc'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cột Phải: Form Fields */}
              <div className="flex-1 space-y-8">
                {/* Nhóm 1: Thông tin định danh */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                    Thông tin định danh
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Họ và tên</Label>
                      <InputWithIcon
                        id="fullName"
                        name="fullName"
                        defaultValue={user.fullName}
                        required
                        icon={User}
                        placeholder="Nhập họ và tên"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                      <BirthdayPicker
                        date={dateOfBirth}
                        setDate={setDateOfBirth}
                        icon={Cake}
                      />
                      <input
                        type="hidden"
                        name="dateOfBirth_display"
                        value={dateOfBirth ? dateOfBirth.toLocaleDateString('vi-VN') : ''}
                      />
                    </div>
                  </div>
                </div>

                {/* Nhóm 2: Thông tin liên hệ */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                    Thông tin liên hệ
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <InputWithIcon
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={user.phone}
                        icon={Phone}
                        placeholder="Nhập số điện thoại"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-not-allowed">
                            <InputWithIcon
                              id="email"
                              name="email"
                              type="email"
                              defaultValue={user.email}
                              readOnly
                              disabled
                              icon={Lock}
                              placeholder="Nhập địa chỉ email"
                              className="bg-muted/50 text-muted-foreground h-11 border-dashed"
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Email đăng ký không thể thay đổi vì lý do bảo mật</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <InputWithIcon
                      id="address"
                      name="address"
                      defaultValue={user.address || ''}
                      icon={MapPin}
                      placeholder="Nhập địa chỉ liên hệ"
                      className="h-11"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end bg-muted/30 p-8 border-t">
            <Button
              type="submit"
              disabled={isPending}
              size="lg"
              className="min-w-[140px] shadow-lg hover:shadow-xl transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                'Lưu thay đổi'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </motion.div>
  )
}
