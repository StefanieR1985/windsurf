// n8n Webhook Integration (client-safe)
// The contact form POSTs the payload to a workflow webhook configured in n8n.
// The webhook URL must be exposed via NEXT_PUBLIC_N8N_WEBHOOK_URL because the
// site is built as a static export and has no server runtime.

export const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ?? "";

export interface N8nResult {
  ok: boolean;
  status: number;
  error?: string;
}

export async function sendToN8n(
  payload: Record<string, unknown>,
  options: { webhookUrl?: string; timeoutMs?: number } = {}
): Promise<N8nResult> {
  const webhookUrl = options.webhookUrl ?? N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      ok: false,
      status: 0,
      error: "NEXT_PUBLIC_N8N_WEBHOOK_URL is not configured",
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 10000);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        receivedAt: new Date().toISOString(),
      }),
      signal: controller.signal,
    });

    return {
      ok: response.ok,
      status: response.status,
      error: response.ok ? undefined : `n8n responded with status ${response.status}`,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.name === "AbortError"
          ? "n8n request timed out"
          : error.message
        : "Unknown error contacting n8n";
    return { ok: false, status: 0, error: message };
  } finally {
    clearTimeout(timeout);
  }
}
