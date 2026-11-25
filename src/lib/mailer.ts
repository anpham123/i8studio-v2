import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

export interface ContactAutoReplyPayload {
  fullName: string;
  email: string;
  service?: string;
  message: string;
  hearAboutUs?: string;
  companyName?: string;
  locale?: string;
  ip?: string;
  createdAt?: Date;
}

const DEFAULT_RESEND_FROM_EMAIL = "onboarding@resend.dev";
const DEFAULT_COMPANY_EMAIL = "info@i8studio.vn";
const BRAND_LEFT_BORDER_GREEN = "#74b838";

function escapeHtml(raw: string): string {
  return String(raw || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function readEnvFileVar(varName: string): string {
  try {
    const envPath = path.join(process.cwd(), ".env");
    if (!fs.existsSync(envPath)) return "";
    const content = fs.readFileSync(envPath, "utf8");
    const regex = new RegExp(`^\\s*${varName}\\s*=\\s*["']?([^"'\\r\\n]+)["']?`, "m");
    const match = content.match(regex);
    return match ? match[1].trim() : "";
  } catch {
    return "";
  }
}

async function getSettingsMap(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.setting.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
}

export async function buildContactAutoReplyHtml(
  payload: ContactAutoReplyPayload,
  settings?: Record<string, string>
): Promise<{ subject: string; html: string; text: string }> {
  const subject =
    settings?.autoReplySubjectJa?.trim() ||
    "【i8 studio】お問い合わせを受け付けました";

  const greetingLine =
    settings?.autoReplyGreetingJa?.trim() ||
    "こんにちは、i8 Studioです。";

  const introText =
    settings?.autoReplyIntroJa?.trim() ||
    "この度は、当社のサービスにご興味をお持ちいただき、ご利用いただき誠にありがとうございます!\n内容を確認の上、24時間以内(土日祝日を除く)に担当者よりご連絡いたします。\n今しばらくお待ちくださいますようお願い申し上げます。";

  const autoNoteText =
    settings?.autoReplyNoteJa?.trim() ||
    "※本メールは自動送信されております。このメールへのご返信はお受けできませんので、ご了承ください。";

  const closingLine =
    settings?.autoReplyClosingJa?.trim() ||
    "よろしくお願いいたします。";

  const safeGreeting = escapeHtml(greetingLine);
  const safeIntro = escapeHtml(introText).replace(/\r?\n/g, "<br/>");
  const safeAutoNote = escapeHtml(autoNoteText).replace(/\r?\n/g, "<br/>");
  const safeClosing = escapeHtml(closingLine);

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f3f3; font-family: 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, 'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #555555; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f3f3; padding: 36px 14px;">
    <tr>
      <td align="center">
        <!-- Main Email Box with Left Green Border (#74b838) -->
        <table role="presentation" width="680" cellpadding="0" cellspacing="0" border="0" style="max-width: 680px; width: 100%; background-color: #fafafa; border-left: 6px solid ${BRAND_LEFT_BORDER_GREEN}; text-align: left;">
          <tr>
            <td style="padding: 36px 40px 38px 36px; font-size: 14.5px; line-height: 1.8; color: #555555;">

              <!-- 1. Greeting -->
              <p style="margin: 0 0 18px 0; font-size: 15px; color: #555555;">
                ${safeGreeting}
              </p>

              <!-- 2. Main Body Paragraphs -->
              <p style="margin: 0 0 22px 0; font-size: 14.5px; line-height: 1.85; color: #555555;">
                ${safeIntro}
              </p>

              <!-- 3. Auto-send Notice -->
              <p style="margin: 0 0 22px 0; font-size: 14px; font-style: italic; color: #555555;">
                ${safeAutoNote}
              </p>

              <!-- 4. Closing (Bold) -->
              <p style="margin: 0; font-size: 16px; font-weight: 700; color: #444444;">
                ${safeClosing}
              </p>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const textLines = [
    greetingLine,
    "",
    introText,
    "",
    autoNoteText,
    "",
    closingLine,
  ];

  return { subject, html, text: textLines.join("\n") };
}

/**
 * Send email directly via Resend HTTP API (https://api.resend.com/emails)
 */
async function sendViaResendApi(params: {
  apiKey: string;
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html?: string;
  text: string;
}): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: params.from,
      to: [params.to],
      ...(params.replyTo ? { reply_to: params.replyTo } : {}),
      subject: params.subject,
      ...(params.html ? { html: params.html } : {}),
      text: params.text,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return { ok: false, error: `Resend API error (${res.status}): ${errText}` };
  }
  return { ok: true };
}

/**
 * Sends the automated confirmation email to the customer's email exclusively via Resend API.
 */
export async function sendContactAutoReplyEmail(
  payload: ContactAutoReplyPayload
): Promise<{ sent: boolean; error?: string }> {
  try {
    const settings = await getSettingsMap();

    if (settings.autoReplyEnabled === "false") {
      return { sent: false, error: "Auto-reply is disabled in settings" };
    }

    const resendApiKey = (
      readEnvFileVar("RESEND_API_KEY") ||
      process.env.RESEND_API_KEY ||
      ""
    ).trim();

    if (!resendApiKey) {
      console.warn(
        "[MAILER - RESEND] RESEND_API_KEY is not configured in .env."
      );
      return { sent: false, error: "RESEND_API_KEY not configured" };
    }

    const senderDisplayName =
      settings.smtpFromNameJa?.trim() || "i8 studio";

    const resendFromAddress = (
      readEnvFileVar("RESEND_FROM_EMAIL") ||
      process.env.RESEND_FROM_EMAIL ||
      DEFAULT_COMPANY_EMAIL
    ).trim();

    const { subject, html, text } = await buildContactAutoReplyHtml(payload, settings);

    let activeFromAddress = resendFromAddress;
    let sendResult = await sendViaResendApi({
      apiKey: resendApiKey,
      from: `${senderDisplayName} <${activeFromAddress}>`,
      to: payload.email,
      subject,
      html,
      text,
    });

    // If i8studio.vn domain is not verified in Resend DNS yet, automatically fallback to onboarding@resend.dev for local testing
    if (
      !sendResult.ok &&
      activeFromAddress !== DEFAULT_RESEND_FROM_EMAIL &&
      sendResult.error?.includes("domain is not verified")
    ) {
      activeFromAddress = DEFAULT_RESEND_FROM_EMAIL;
      sendResult = await sendViaResendApi({
        apiKey: resendApiKey,
        from: `${senderDisplayName} <${activeFromAddress}>`,
        to: payload.email,
        subject,
        html,
        text,
      });
    }

    if (!sendResult.ok) {
      console.error("[MAILER - RESEND]", sendResult.error);
      return { sent: false, error: sendResult.error };
    }

    if (settings.notifyAdminOnContact !== "false") {
      const adminTarget = (
        settings.email ||
        DEFAULT_COMPANY_EMAIL
      ).trim();

      if (adminTarget && adminTarget.toLowerCase() !== payload.email.toLowerCase()) {
        await sendViaResendApi({
          apiKey: resendApiKey,
          from: `${senderDisplayName} Website <${activeFromAddress}>`,
          to: adminTarget,
          replyTo: payload.email,
          subject: `【Liên hệ mới từ Website】${payload.fullName} (${payload.service || "Tư vấn chung"})`,
          text: `Có một liên hệ mới từ website i8studio.vn:\n\nHọ tên: ${payload.fullName}\nEmail: ${payload.email}\nDịch vụ: ${payload.service || "Chưa chọn"}\nKênh biết đến: ${payload.hearAboutUs || "Chưa chọn"}\nIP: ${payload.ip || "N/A"}\n\nNội dung tin nhắn:\n${payload.message}`,
        }).catch((err) => {
          console.warn("[MAILER - RESEND] Admin notification skipped:", err);
        });
      }
    }

    return { sent: true };
  } catch (err) {
    console.error("[MAILER - RESEND] Failed to send contact auto-reply email:", err);
    return {
      sent: false,
      error: err instanceof Error ? err.message : "Failed to send email via Resend",
    };
  }
}
