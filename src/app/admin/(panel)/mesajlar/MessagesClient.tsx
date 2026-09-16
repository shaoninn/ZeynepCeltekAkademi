"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiJson } from "@/components/admin/AdminForm";

interface Msg {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function MessagesClient({ initial }: { initial: Msg[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"unread" | "all">("unread");

  async function markRead(id: string, isRead: boolean) {
    await apiJson("/api/messages", {
      method: "PUT",
      body: JSON.stringify({ id, isRead }),
    });
    router.refresh();
  }

  async function onDelete(id: string) {
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    await apiJson(`/api/messages?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  const visible =
    filter === "unread" ? initial.filter((m) => !m.isRead) : initial;
  const unreadCount = initial.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={`text-xs px-3 py-2 rounded-lg border min-h-11 ${
            filter === "unread"
              ? "border-orange text-orange"
              : "border-[#333] text-[#888]"
          }`}
        >
          Okunmadı ({unreadCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`text-xs px-3 py-2 rounded-lg border min-h-11 ${
            filter === "all"
              ? "border-orange text-orange"
              : "border-[#333] text-[#888]"
          }`}
        >
          Tümü ({initial.length})
        </button>
      </div>
      {visible.length === 0 && (
        <p className="text-[#666]">
          {filter === "unread" ? "Okunmamış mesaj yok." : "Henüz mesaj yok."}
        </p>
      )}
      {visible.map((m) => (
        <div
          key={m.id}
          className={`admin-card p-5 ${m.isRead ? "opacity-70" : "border-orange/30"}`}
        >
          <div className="flex justify-between gap-4 mb-2">
            <div>
              <p className="font-semibold text-white">
                {m.name}{" "}
                {!m.isRead && (
                  <span className="text-xs text-orange ml-2">Yeni</span>
                )}
              </p>
              <p className="text-xs text-[#666]">
                {m.phone}
                {m.email ? ` · ${m.email}` : ""} ·{" "}
                {new Date(m.createdAt).toLocaleString("tr-TR")}
              </p>
            </div>
            <div className="flex gap-2 text-sm shrink-0">
              <button
                type="button"
                className="text-orange"
                onClick={() => markRead(m.id, !m.isRead)}
              >
                {m.isRead ? "Okunmadı" : "Okundu"}
              </button>
              <button
                type="button"
                className="text-red-400"
                onClick={() => onDelete(m.id)}
              >
                Sil
              </button>
            </div>
          </div>
          {m.subject && (
            <p className="text-sm text-[#aaa] mb-1">Konu: {m.subject}</p>
          )}
          <p className="text-sm text-[#ccc] whitespace-pre-wrap">{m.message}</p>
          {m.phone.replace(/\D/g, "").length >= 10 ? (
            <a
              href={`https://wa.me/${m.phone.replace(/\D/g, "").replace(/^0/, "90")}?text=${encodeURIComponent(`Merhaba ${m.name}, Zeynep Çeltek Güzellik Akademi’den yazıyoruz.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mt-3 min-h-11 items-center text-sm text-[#25D366] hover:underline"
            >
              WhatsApp’ta yanıtla
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );
}
