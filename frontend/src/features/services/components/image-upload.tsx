"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({ value, onChange, disabled, className }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onChange(objectUrl);
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative w-[160px] h-[160px] rounded-xl overflow-hidden border border-border group shrink-0 shadow-sm">
            <Image
              src={preview}
              alt="Service preview"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleRemove}
                disabled={disabled}
                aria-label="Xóa ảnh đại diện"
                className="h-9 w-9 rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-[160px] h-[160px] rounded-xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 shrink-0 group bg-muted/5 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="p-4 rounded-full bg-background shadow-sm mb-3 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 relative z-10">
              <ImagePlus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            </div>
            <span className="text-xs text-muted-foreground font-medium group-hover:text-primary transition-colors duration-300 relative z-10">Tải ảnh lên</span>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
