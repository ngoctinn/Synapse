"use client";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useEffect, useState } from "react";
import { NotificationChannel } from "../types";

interface ChannelConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  channel?: NotificationChannel;
  onSave: (channelId: string, config: unknown) => void;
  isSaving?: boolean;
}

export function ChannelConfigDialog({
  isOpen,
  onOpenChange,
  channel,
  onSave,
  isSaving = false,
}: ChannelConfigDialogProps) {
  const [localConfig, setLocalConfig] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (channel) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalConfig((prev) => {
        const newConfig = channel.config || {};
        if (JSON.stringify(prev) !== JSON.stringify(newConfig)) {
            return newConfig;
        }
        return prev;
      });
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
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0 space-y-0">
          <DialogTitle className="text-lg">Cấu hình {channel.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 p-6">
          {Object.keys(channel.config).length > 0 ? (
            Object.keys(channel.config).map((key) => (
              <div key={key} className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor={key} className="text-left sm:text-right capitalize cursor-pointer">
                  {key}
                </Label>
                <Input
                  id={key}
                  value={(localConfig[key] as string) || ""}
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
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Đang lưu..." : "Lưu kết nối"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
