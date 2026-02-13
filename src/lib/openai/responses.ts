type OpenAIResponsePayload = Record<string, unknown>;

const DEFAULT_TIMEOUT_MS = 15000;

export async function callOpenAIResponsesApi(payload: OpenAIResponsePayload, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OpenAI API request failed (${response.status}): ${details.slice(0, 600)}`);
  }

  return (await response.json()) as Record<string, unknown>;
}
