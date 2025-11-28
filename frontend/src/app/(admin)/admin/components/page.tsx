import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Checkbox } from "@/shared/ui/checkbox"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Separator } from "@/shared/ui/separator"
import { Switch } from "@/shared/ui/switch"
import { Mail, User } from "lucide-react"

export default function ComponentsPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">UI Components</h1>
        <p className="text-muted-foreground">
          Trang kiểm thử các component giao diện được sử dụng trong hệ thống.
        </p>
      </div>

      <Separator />

      <div className="grid gap-8 md:grid-cols-2">
        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Các biến thể của nút bấm.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon"><User className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button disabled>Disabled</Button>
              <Button>
                <Mail className="mr-2 h-4 w-4" /> Login with Email
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inputs */}
        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
            <CardDescription>Các trường nhập liệu cơ bản.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="Email" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" placeholder="Password" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="disabled">Disabled</Label>
              <Input disabled id="disabled" placeholder="Disabled input" />
            </div>
          </CardContent>
        </Card>

        {/* Avatars & Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Avatars & Badges</CardTitle>
            <CardDescription>Hình đại diện và nhãn trạng thái.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://github.com/vercel.png" />
                <AvatarFallback>VC</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-wrap gap-4">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
            <CardDescription>Switch, Checkbox và các điều khiển khác.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <Switch id="airplane-mode" />
              <Label htmlFor="airplane-mode">Airplane Mode</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
