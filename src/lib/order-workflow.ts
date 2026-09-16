import { formatPrice } from "@/lib/utils";

export const WORKFLOW_STEPS = [
  { id: "INTAKE", label: "Yeni" },
  { id: "MEASURE", label: "Görüşüldü" },
  { id: "PRODUCTION", label: "Görüşüldü" },
  { id: "SHIP", label: "Kayıt tamam" },
  { id: "DONE", label: "Kayıt tamam" },
] as const;

export const OWNER_WORKFLOW_STEPS = [
  { id: "INTAKE", label: "Yeni" },
  { id: "MEASURE", label: "Görüşüldü" },
  { id: "DONE", label: "Kayıt tamam" },
] as const;

export type WorkflowId = (typeof WORKFLOW_STEPS)[number]["id"];
export type OwnerWorkflowId = (typeof OWNER_WORKFLOW_STEPS)[number]["id"];

export function ownerColumnId(id: string): OwnerWorkflowId {
  if (id === "MEASURE" || id === "PRODUCTION") return "MEASURE";
  if (id === "SHIP" || id === "DONE") return "DONE";
  return "INTAKE";
}

export function workflowIndex(id: string): number {
  const idx = OWNER_WORKFLOW_STEPS.findIndex((s) => s.id === ownerColumnId(id));
  return idx >= 0 ? idx : 0;
}

export function workflowLabel(id: string): string {
  const col = OWNER_WORKFLOW_STEPS.find((s) => s.id === ownerColumnId(id));
  return col?.label ?? id;
}

export function nextWorkflowId(id: string): WorkflowId | null {
  const col = ownerColumnId(id);
  if (col === "INTAKE") return "MEASURE";
  if (col === "MEASURE") return "DONE";
  return null;
}

export function prevWorkflowId(id: string): WorkflowId | null {
  const col = ownerColumnId(id);
  if (col === "DONE") return "MEASURE";
  if (col === "MEASURE") return "INTAKE";
  return null;
}

export function buildAdminWhatsAppMessage(order: {
  orderNo: string;
  name: string;
  phone: string;
  total: number;
  items: {
    productName: string;
    quantity: number;
    widthCm?: number | null;
    heightCm?: number | null;
    color?: string | null;
    optionsNote?: string | null;
  }[];
}): string {
  const lines = [
    `Merhaba ${order.name},`,
    ``,
    `Zeynep Çeltek Güzellik Akademi kayıt talebiniz (${order.orderNo}) hakkında bilgi:`,
    ``,
    ...order.items.map((item) => {
      const note = item.optionsNote ? ` — ${item.optionsNote}` : "";
      return `• ${item.productName} × ${item.quantity}${note}`;
    }),
    ``,
    `Tahmini toplam: ${formatPrice(order.total)}`,
    ``,
    `Detay ve program teyidi için dönüş yapabilir misiniz?`,
    `Tel: ${order.phone}`,
  ];
  return lines.join("\n");
}
