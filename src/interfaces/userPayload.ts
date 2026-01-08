export interface userPayload {
  userId: string;
  role: "super_admin" | "doctor" | "nurse";
  fullName: string;
  email: string;
  sessionId?: string;
}
