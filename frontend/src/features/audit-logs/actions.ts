"use server";

import { MOCK_AUDIT_LOGS } from "./model/mocks";
import { AuditLog, PaginatedAuditLogs } from "./model/types";

export async function getAuditLogs(
  page = 1,
  pageSize = 10,
  filter?: { action?: string; entityType?: string } // simplified filter
): Promise<PaginatedAuditLogs> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filtered = [...MOCK_AUDIT_LOGS];

  if (filter?.action && filter.action !== "all") {
    filtered = filtered.filter((log) => log.action === filter.action);
  }

  if (filter?.entityType && filter.entityType !== "all") {
    filtered = filtered.filter((log) => log.entity_type === filter.entityType);
  }

  // Sort by created_at desc
  filtered.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = filtered.slice(start, end);
  const totalPages = Math.ceil(total / pageSize);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages,
  };
}
