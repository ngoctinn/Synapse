export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "APPROVE"
  | "REJECT"
  | "CANCEL"
  | "COMPLETE";

export type AuditEntity =
  | "USER"
  | "CUSTOMER"
  | "BOOKING"
  | "SERVICE"
  | "PRODUCT"
  | "INVOICE"
  | "SYSTEM";

export interface AuditLog {
  id: string;
  action: AuditAction;
  entity_type: AuditEntity;
  entity_id: string;
  entity_name?: string; // Human readable name if applicable
  actor_id: string;
  actor_name: string;
  details: Record<string, unknown>;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
}

export interface PaginatedAuditLogs {
  data: AuditLog[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuditLogFilter {
  startDate?: Date;
  endDate?: Date;
  actorId?: string;
  action?: AuditAction;
  entityType?: AuditEntity;
}
