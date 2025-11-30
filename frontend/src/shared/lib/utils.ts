import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toCamelCase(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map((v) => toCamelCase(v));
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((result, key) => {
      const newKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      return {
        ...result,
        [newKey]: toCamelCase((obj as Record<string, unknown>)[key]),
      };
    }, {} as Record<string, unknown>);
  }
  return obj;
}

export function toSnakeCase(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map((v) => toSnakeCase(v));
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((result, key) => {
      const newKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      return {
        ...result,
        [newKey]: toSnakeCase((obj as Record<string, unknown>)[key]),
      };
    }, {} as Record<string, unknown>);
  }
  return obj;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}
