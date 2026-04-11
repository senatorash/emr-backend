export interface userPayload {
  userId: string;
  role: "super_admin" | "admin" | "doctor" | "nurse";
  firstName: string;
  lastName: string;
  email: string;
  hospital?: string | null;
  hospitalName?: string | null;
  sessionId?: string;
}
