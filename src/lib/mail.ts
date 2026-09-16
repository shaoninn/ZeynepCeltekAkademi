import { formatPrice } from "@/lib/utils";
import { getSiteUrl } from "@/lib/seo";

interface OrderEmailItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  widthCm?: number | null;
  heightCm?: number | null;
  color?: string | null;
}

function mailFromFallback(kind: "resend" | "smtp"): string {
  if (process.env.MAIL_FROM) return process.env.MAIL_FROM;
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[mail] MAIL_FROM tanımlı değil; production’da gerçek domain e-posta adresi ayarlayın."
    );
  }
  if (kind === "resend") {
    return "Zeynep Çeltek Güzellik Akademi <onboarding@resend.dev>";
  }
  return "noreply@zeynepceltekakademi.com";
}

interface OrderEmailPayload {
  orderNo: string;
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  note?: string | null;
  total: number;
  items: OrderEmailItem[];
}

function orderHtml(order: OrderEmailPayload): string {
  const lines = order.items
    .map((i) => {
      return `<tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${i.productName}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatPrice(i.lineTotal)}</td>
      </tr>`;
    })
    .join("");

  return `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#222">
    <h2>Ön kayıt talebiniz alındı — ${order.orderNo}</h2>
    <p>Merhaba ${order.name},</p>
    <p>Kayıt talebiniz Zeynep Çeltek Güzellik Akademi sistemine düştü. Kontenjan ve program için en kısa sürede sizinle iletişime geçeceğiz.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <thead><tr>
        <th style="text-align:left;padding:8px;border-bottom:2px solid #f97316">Eğitim</th>
        <th style="padding:8px;border-bottom:2px solid #f97316">Kişi</th>
        <th style="text-align:right;padding:8px;border-bottom:2px solid #f97316">Tutar</th>
      </tr></thead>
      <tbody>${lines}</tbody>
    </table>
    <p><strong>Eğitim ücreti (kayıt):</strong> ${formatPrice(order.total)}</p>
    <p style="color:#666;font-size:13px">Sabit eğitim ücreti; kayıt WhatsApp veya ön kayıt ile netleşir. Sitede online ödeme yoktur.</p>
    <p>Telefon: ${order.phone}${order.address ? `<br/>Adres: ${order.address}` : ""}</p>
  </body></html>`;
}

export async function sendOrderConfirmation(
  order: OrderEmailPayload
): Promise<{ sent: boolean; reason?: string }> {
  if (!order.email) {
    return { sent: false, reason: "no-email" };
  }

  const subject = `Zeynep Çeltek Güzellik Akademi ön kayıt özeti — ${order.orderNo}`;
  const html = orderHtml(order);
  const text = `Ön kayıt talebiniz alındı: ${order.orderNo}. Eğitim ücreti: ${formatPrice(order.total)}`;

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const from = mailFromFallback("resend");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [order.email],
        subject,
        html,
        text,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return { sent: false, reason: "resend-failed" };
    }
    return { sent: true };
  }

  const smtpUrl = process.env.SMTP_URL;
  if (smtpUrl) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport(smtpUrl);
      await transporter.sendMail({
        from: mailFromFallback("smtp"),
        to: order.email,
        subject,
        html,
        text,
      });
      return { sent: true };
    } catch (e) {
      console.error("SMTP error:", e);
      return { sent: false, reason: "smtp-failed" };
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.info(`[mail:dev] Would send order confirmation to ${order.email}: ${subject}`);
    return { sent: false, reason: "no-mail-provider" };
  }

  return { sent: false, reason: "no-mail-provider" };
}

async function deliverMail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const from = mailFromFallback("resend");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
      }),
    });
    if (!res.ok) {
      console.error("Resend error:", await res.text());
      return { sent: false, reason: "resend-failed" };
    }
    return { sent: true };
  }

  const smtpUrl = process.env.SMTP_URL;
  if (smtpUrl) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport(smtpUrl);
      await transporter.sendMail({
        from: mailFromFallback("smtp"),
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
      });
      return { sent: true };
    } catch (e) {
      console.error("SMTP error:", e);
      return { sent: false, reason: "smtp-failed" };
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.info(`[mail:dev] ${opts.subject} → ${opts.to}`);
    return { sent: false, reason: "no-mail-provider" };
  }
  return { sent: false, reason: "no-mail-provider" };
}

async function ownerNotifyTo(): Promise<string | null> {
  const { prisma } = await import("@/lib/db");
  const row = await prisma.siteSetting.findUnique({
    where: { key: "notify_email" },
  });
  return (
    row?.value?.trim() ||
    process.env.MAIL_FROM_NOTIFY?.trim() ||
    process.env.MAIL_MANUFACTURER?.trim() ||
    null
  );
}

export async function sendOwnerLeadAlert(opts: {
  kind: "contact" | "order";
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  orderNo?: string;
  adminPath: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const to = await ownerNotifyTo();
  if (!to) return { sent: false, reason: "no-notify-email" };

  const site = getSiteUrl();
  const adminUrl = `${site}${opts.adminPath}`;
  const subject =
    opts.kind === "order"
      ? `[Kayıt] ${opts.orderNo || ""} — ${opts.name}`
      : `[Mesaj] ${opts.name}`;
  const text = [
    opts.kind === "order" ? "Yeni eğitim kayıt talebi" : "Yeni iletişim mesajı",
    `Ad: ${opts.name}`,
    `Telefon: ${opts.phone}`,
    opts.email ? `E-posta: ${opts.email}` : null,
    opts.orderNo ? `Kayıt no: ${opts.orderNo}` : null,
    opts.message ? `Mesaj: ${opts.message}` : null,
    `Panel: ${adminUrl}`,
  ]
    .filter(Boolean)
    .join("\n");
  const html = `<pre style="font-family:sans-serif;white-space:pre-wrap">${text}</pre>`;

  return deliverMail({ to, subject, html, text });
}

export async function sendCrmReminder(order: {
  orderNo: string;
  name: string;
  phone: string;
  email?: string | null;
  total: number;
}): Promise<{ sent: boolean; reason?: string }> {
  if (!order.email) return { sent: false, reason: "no-email" };
  const subject = `Kayıt talebiniz bekliyor — ${order.orderNo}`;
  const text = `Merhaba ${order.name}, ${order.orderNo} numaralı eğitim kayıt talebiniz için program/onay görüşmesi yapmak isteriz. Tahmini toplam: ${formatPrice(order.total)}. Telefon: ${order.phone}`;
  const html = `<p>${text}</p><p>Zeynep Çeltek Güzellik Akademi</p>`;
  return deliverMail({ to: order.email, subject, html, text });
}
