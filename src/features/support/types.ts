import type { EpochMillis } from "@/lib/firestore-timestamps";

export type SupportTicketStatus = "open" | "closed";

export type SupportTicket = {
  id: string;
  ownerId: string;
  email: string;
  description: string;
  createdAt: EpochMillis | null;
  status: SupportTicketStatus;
};
