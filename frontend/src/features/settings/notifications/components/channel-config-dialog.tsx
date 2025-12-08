"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { NotificationChannel } from "../types";
import { useState, useEffect } from "react";

interface ChannelConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  channel?: NotificationChannel;
  onSave: (channelId: string, config: any) => void;
}

export function ChannelConfigDialog({
  isOpen,
  onOpenChange,
  channel,
  onSave,
}: ChannelConfigDialogProps) {
  const [localConfig, setLocalConfig] = useState<Record<string, any>>({});

  useEffect(() => {
    if (channel) {
      setLocalConfig(channel.config || {});
    }
  }, [channel]);

  const handleChange = (key: string, value: string) => {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (channel) {
      onSave(channel.id, localConfig);
      onOpenChange(false);
    }
  };

  if (!channel) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cấu hình {channel.name}</DialogTitle>
          <DialogDescription>
            Nhập thông tin xác thực để kết nối với dịch vụ {channel.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {Object.keys(channel.config).length > 0 ? (
            Object.keys(channel.config).map((key) => (
              <div key={key} className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor={key} className="text-left sm:text-right capitalize cursor-pointer">
                  {key}
                </Label>
                <Input
                  id={key}
                  value={localConfig[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="col-span-1 sm:col-span-3"
                  type={key.toLowerCase().includes("password") || key.toLowerCase().includes("token") ? "password" : "text"}
                />
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-4">
              Không có cấu hình nào cần thiết cho kênh này.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Lưu kết nối</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
