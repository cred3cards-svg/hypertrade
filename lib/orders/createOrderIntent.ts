import type { OrderTicketInput } from "@/lib/validation/order";

export type LocalOrderIntent = OrderTicketInput & {
  id: string;
  status: "DRAFT" | "SUBMITTED";
  clientOrderId: string;
  rawRequestJson: unknown;
  createdAt: string;
};

export function createLocalOrderIntent(order: OrderTicketInput): LocalOrderIntent {
  const createdAt = new Date().toISOString();
  const clientOrderId = `dp_${createdAt.replace(/\D/g, "")}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;

  return {
    ...order,
    id: clientOrderId,
    status: "DRAFT",
    clientOrderId,
    rawRequestJson: order,
    createdAt
  };
}
