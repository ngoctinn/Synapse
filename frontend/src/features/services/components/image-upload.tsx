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

export function ImageUpload({
  value,
  onChange,
  disabled,
  className,
}: ImageUploadProps) {
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
          <div className="upload-preview-container group">
            <Image
              src={preview}
              alt="Service preview"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleRemove}
                disabled={disabled}
                aria-label="Xóa ảnh đại diện"
                className="h-9 w-9 scale-90 rounded-full shadow-lg transition-transform duration-300 group-hover:scale-100"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="upload-trigger-dashed group"
          >
            <div className="to-muted/20 absolute inset-0 bg-gradient-to-br from-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="bg-background relative z-10 mb-3 rounded-full p-4 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
              <ImagePlus className="text-muted-foreground group-hover:text-primary h-6 w-6 transition-colors duration-300" />
            </div>
            <span className="text-muted-foreground group-hover:text-primary relative z-10 text-xs font-medium transition-colors duration-300">
              Tải ảnh lên
            </span>
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
