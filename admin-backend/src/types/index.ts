export interface AdminPayload {
  adminId: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuditLogInput {
  action: string;
  entityType: "user" | "note";
  entityId: string;
  details?: Record<string, any>;
}
