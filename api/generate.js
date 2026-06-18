import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key no configurada en el servidor" });
  }
  try {
    const { system, messages, max_tokens, originalReview, channel, language } = req.body;
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: max_tokens || 1000,
        system,
        messages,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      const generatedText = data.content?.[0]?.text;
      if (generatedText) {
        try {
          await supabase.from("responses").insert({
            business_id: null,
            original_review: originalReview || messages?.[0]?.content || "",
            generated_response: generatedText,
            language: language || "es",
            channel: channel || null,
          });
        } catch (dbErr) {
          console.error("Error guardando en Supabase:", dbErr);
        }
      }
    }

    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
