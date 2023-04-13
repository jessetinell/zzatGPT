type Role = "user" | "system";

export interface Message {
  role: Role;
  content?: string;
  timestamp?: number;
}