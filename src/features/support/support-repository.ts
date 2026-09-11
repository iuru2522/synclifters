import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirebaseFirestore, getFirebaseSetupMessage } from "@/lib/firebase";
import type { SupportTicket } from "@/features/support/types";

export type CreateSupportTicketInput = {
  ownerId: string;
  email: string;
  description: string;
};

function requireFirestore() {
  const db = getFirebaseFirestore();

  if (!db) {
    throw new Error(getFirebaseSetupMessage());
  }

  return db;
}

export async function createSupportTicket(
  input: CreateSupportTicketInput,
): Promise<SupportTicket> {
  const email = input.email.trim().toLowerCase();
  const description = input.description.trim();

  if (!email) {
    throw new Error("Email is required.");
  }

  if (!description) {
    throw new Error("Description is required.");
  }

  if (!input.ownerId.trim()) {
    throw new Error("You must be signed in to submit a support request.");
  }

  const createdAt = new Date();
  const ref = await addDoc(collection(requireFirestore(), "supportTickets"), {
    ownerId: input.ownerId,
    email,
    description,
    createdAt: serverTimestamp(),
    status: "open",
  });

  return {
    id: ref.id,
    ownerId: input.ownerId,
    email,
    description,
    createdAt: createdAt.getTime(),
    status: "open",
  };
}
