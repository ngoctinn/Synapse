"use client"

import { updateProfile } from "@/features/customer-dashboard/actions"
import { UserProfile } from "@/features/customer-dashboard/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon"
import { Label } from "@/shared/ui/label"
import { Camera, Check, Mail, Phone, User } from "lucide-react"
import { useActionState, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

interface ProfileFormProps {
  user: UserProfile
}

const initialState = {
  message: '',
  success: false,
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState)
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user.avatarUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message)
      } else {
        toast.error(state.message)
      }
    }
  }, [state])

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setAvatarPreview(objectUrl)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>
            Cập nhật thông tin liên hệ và ảnh đại diện của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Avatar */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                <Avatar className="h-32 w-32 border-2 border-border">
                  <AvatarImage src={avatarPreview} alt={user.fullName} className="object-cover" />
                  <AvatarFallback className="text-4xl">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleAvatarClick}>
                Đổi ảnh đại diện
              </Button>
              <input
                type="file"
                name="avatar"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Right Column: Form Fields */}
            <div className="md:col-span-2 space-y-4">
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
                <Label htmlFor="phone">Số điện thoại</Label>
                <InputWithIcon
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={user.phone}
                  required
                  icon={Phone}
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
