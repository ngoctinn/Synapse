"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

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

  useEffect(() => {
    setPreview(value);
  }, [value]);

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
          <div className="group relative h-24 w-24 overflow-hidden rounded-lg border">
            <Image
              src={preview}
              alt="Preview"
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
                aria-label="Xóa ảnh"
                className="h-8 w-8 rounded-full shadow-lg transition-transform duration-300 group-hover:scale-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-muted-foreground/25 bg-muted/5 hover:bg-muted/10 group relative flex h-24 w-24 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed transition-colors"
          >
            <div
              className={`to-muted/20 absolute inset-0 bg-gradient-to-br from-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
            />
            <div className="bg-background relative z-10 mb-2 rounded-full p-2 shadow-sm transition-all duration-300 group-hover:scale-110">
              <ImagePlus className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-colors duration-300" />
            </div>
            <span className="text-muted-foreground group-hover:text-primary relative z-10 text-[10px] font-medium transition-colors duration-300">
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
