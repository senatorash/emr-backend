export interface userPayload {
  _id: string;
  role: "super_admin" | "doctor" | "nurse";
  fullName: string;
  email: string;
}
