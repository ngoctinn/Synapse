"use client";

import { Button } from "@/shared/ui/button";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onChange(objectUrl); // In a real app, we would upload here and return the URL
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative w-[140px] h-[140px] rounded-lg overflow-hidden border border-slate-200 group shrink-0">
            <Image
              src={preview}
              alt="Service preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleRemove}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-[140px] h-[140px] rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors shrink-0"
          >
            <ImagePlus className="h-8 w-8 text-slate-400 mb-2" />
            <span className="text-xs text-slate-500 font-medium">Tải ảnh lên</span>
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
