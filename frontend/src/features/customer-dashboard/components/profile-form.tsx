"use client"

import { updateProfile } from "@/features/customer-dashboard/actions"
import { UserProfile } from "@/features/customer-dashboard/types"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { useActionState, useEffect } from "react"
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

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message)
      } else {
        toast.error(state.message)
      }
    }
  }, [state])

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>
            Cập nhật thông tin liên hệ của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input id="fullName" name="fullName" defaultValue={user.fullName} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={user.email} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input id="phone" name="phone" type="tel" defaultValue={user.phone} required />
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
