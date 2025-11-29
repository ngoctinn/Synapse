"use client"

import { updateProfile } from "@/features/customer-dashboard/actions"
import { UserProfile } from "@/features/customer-dashboard/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"
import { DatePicker } from "@/shared/ui/custom/date-picker"
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon"
import { showToast } from "@/shared/ui/custom/sonner"
import { Label } from "@/shared/ui/label"
import { Camera, Check, Mail, MapPin, Phone, User } from "lucide-react"
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
    <form action={formAction}>
      <input type="hidden" name="avatarUrl" value={avatarUrl || ''} />
      {dateOfBirth && (
        <input
          type="hidden"
          name="dateOfBirth"
          value={dateOfBirth.toISOString().split('T')[0]}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>
            Cập nhật thông tin liên hệ và ảnh đại diện của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column: Avatar */}
            <div className="flex flex-col items-center space-y-4 md:w-1/3">
              <div className="relative">
                <AvatarSelector
                  currentAvatar={avatarUrl}
                  onSelect={handleAvatarSelect}
                  trigger={
                    <div className="relative group cursor-pointer">
                      <Avatar className="h-32 w-32 border-4 border-background shadow-xl ring-2 ring-muted">
                        <AvatarImage src={avatarUrl} alt={user.fullName} className="object-cover" />
                        <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                          {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors">
                        <Camera className="h-4 w-4" />
                      </div>
                    </div>
                  }
                />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{user.fullName}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {/* Right Column: Form Fields */}
            <div className="flex-1 space-y-6">
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <InputWithIcon
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={user.phone}
                    icon={Phone}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <InputWithIcon
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    readOnly
                    disabled
                    icon={Mail}
                    rightIcon={Check}
                    rightIconProps={{ className: "text-green-500" }}
                    placeholder="Nhập địa chỉ email"
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                  <div className="relative">
                    <DatePicker
                      date={dateOfBirth}
                      setDate={setDateOfBirth}
                    />
                    <input
                      type="hidden"
                      name="dateOfBirth_display"
                      value={dateOfBirth ? dateOfBirth.toLocaleDateString('vi-VN') : ''}
                    />
                  </div>
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
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end bg-muted/20 p-6">
          <Button type="submit" disabled={isPending} className="min-w-[120px]">
            {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
