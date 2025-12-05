
import { ExceptionDate, TimeSlot } from "../model/types";
import { format } from "date-fns";

/**
 * Helper để kiểm tra xem một ngày có nằm trong danh sách đang chọn không
 * (Dựa trên so sánh chuỗi YYYY-MM-DD để tránh vấn đề timezone của Date object)
 */
export function isDateSelected(date: Date, selectedIds: Set<string>): boolean {
    const dateId = format(date, 'yyyy-MM-dd');
    return selectedIds.has(dateId);
}

export interface BulkExceptionConfig {
    reason?: string;
    type?: 'holiday' | 'maintenance' | 'custom';
    isClosed?: boolean;
    modifiedHours?: TimeSlot[];
}

/**
 * Áp dụng cấu hình Exception cho một danh sách ngày.
 * Nếu ngày đó đã có exception (dựa trên mảng existingExceptions), sẽ update.
 * Nếu chưa, sẽ tạo mới.
 */
export function applyExceptionToDates(
    dates: Date[],
    config: BulkExceptionConfig,
    existingExceptions: ExceptionDate[]
): ExceptionDate[] {
    // Tạo map để tra cứu nhanh existing exceptions theo Date ID
    const existingMap = new Map<string, ExceptionDate>();
    existingExceptions.forEach(ex => {
        const id = format(ex.date, 'yyyy-MM-dd');
        existingMap.set(id, ex);
    });

    const result: ExceptionDate[] = [];

    // Danh sách ngày cần xử lý (loại bỏ trùng lặp nếu có)
    const processedDateIds = new Set<string>();

    dates.forEach(date => {
        const dateId = format(date, 'yyyy-MM-dd');
        if (processedDateIds.has(dateId)) return;
        processedDateIds.add(dateId);

        const existing = existingMap.get(dateId);
        
        if (existing) {
            // Update existing
            result.push({
                ...existing,
                ...config,
                // Giữ nguyên ID, Date cũ
                id: existing.id, 
                date: existing.date 
            });
        } else {
            // Create new
            // Nếu không có reason trong config, dùng default hoặc phải validate trước khi gọi hàm này
            if (!config.reason && !config.type) {
                // Skip invalid config for new items if strictly required?
                // For now, assume config provides necessary fields or UI handles defaults.
            }
            
            result.push({
                id: crypto.randomUUID(), // New ID
                date: date,
                reason: config.reason || "Sự kiện mới",
                type: config.type || 'custom',
                isClosed: config.isClosed ?? true,
                modifiedHours: config.modifiedHours
            });
        }
    });

    return result;
}
