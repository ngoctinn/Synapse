"use client";

import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Check, RefreshCw } from "lucide-react";
import * as React from "react";

interface AvatarSelectorProps {
  currentAvatar?: string | null;
  onSelect: (avatarUrl: string) => void;
  trigger?: React.ReactNode;
}

const generateAvatars = (count: number) => {
  return Array.from({ length: count }).map(() => {
    const seed = Math.random().toString(36).substring(7);
    return `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;
  });
};

export function AvatarSelector({
  currentAvatar,
  onSelect,
  trigger,
}: AvatarSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [avatars, setAvatars] = React.useState<string[]>([]);
  const [selectedAvatar, setSelectedAvatar] = React.useState<string | null>(
    currentAvatar || null
  );

  React.useEffect(() => {
    if (open && avatars.length === 0) {
      setAvatars(generateAvatars(12));
    }
  }, [open, avatars.length]);

  const handleRefresh = () => {
    setAvatars(generateAvatars(12));
  };

  const handleSave = () => {
    if (selectedAvatar) {
      onSelect(selectedAvatar);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Đổi ảnh đại diện</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chọn ảnh đại diện</DialogTitle>
          <DialogDescription>
            Chọn một hình đại diện từ danh sách bên dưới hoặc làm mới để xem
            thêm.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          {avatars.map((avatar, index) => (
            <div
              key={index}
              className={cn(
                "relative cursor-pointer rounded-full p-1 transition-all hover:scale-105",
                selectedAvatar === avatar
                  ? "ring-primary ring-2 ring-offset-2"
                  : "hover:ring-muted-foreground/20 hover:ring-2"
              )}
              onClick={() => setSelectedAvatar(avatar)}
            >
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatar} alt={`Avatar option ${index + 1}`} />
                <AvatarFallback>AV</AvatarFallback>
              </Avatar>
              {selectedAvatar === avatar && (
                <div className="bg-primary text-primary-foreground absolute bottom-0 right-0 rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
          ))}
        </div>
        <DialogFooter className="flex gap-2 sm:justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="size-4" />
            Làm mới
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={!selectedAvatar}>
              Lưu thay đổi
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
