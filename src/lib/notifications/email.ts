import { Resend } from "resend";

export async function sendOrderEmail(params: {
  orderNumber: number;
  customerName: string;
  phone: string;
  address: string;
  comment: string | null;
  totalAmount: number;
  itemsText: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;

  if (!apiKey || !to) {
    console.warn("Email не настроен: пропущен RESEND_API_KEY/ADMIN_NOTIFICATION_EMAIL");
    return false;
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      subject: `Новая заявка №${params.orderNumber}`,
      html: `
        <h2>Новая заявка №${params.orderNumber}</h2>
        <p><b>Имя:</b> ${escapeHtml(params.customerName)}</p>
        <p><b>Телефон:</b> ${escapeHtml(params.phone)}</p>
        <p><b>Адрес:</b> ${escapeHtml(params.address)}</p>
        ${params.comment ? `<p><b>Комментарий:</b> ${escapeHtml(params.comment)}</p>` : ""}
        <p><b>Состав заказа:</b></p>
        <pre>${escapeHtml(params.itemsText)}</pre>
        <p><b>Итого:</b> ${params.totalAmount.toLocaleString("ru-RU")} ₽</p>
      `,
    });
    return !error;
  } catch (err) {
    console.error("Ошибка отправки email:", err);
    return false;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
