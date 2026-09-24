import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const Input = z.object({
  reflections: z.array(z.string().trim().min(1).max(2000)).min(1).max(50),
});

export const summarizeReflections = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured.");

    const list = data.reflections.map((r, i) => `${i + 1}. ${r}`).join("\n");
    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        stream: true,
        reasoning: { effort: "low" },
        instructions:
          "You help a group facilitator after a conversation card game. You receive anonymous reflections from participants. Summarize the shared themes warmly and briefly. Never quote anyone verbatim, never guess who said what, never give advice or diagnose. Format: a one-sentence overview, then 3-5 short themes as '- Theme: one sentence'. Under 180 words. Plain text only.",
        input: `Anonymous reflections:\n${list}`,
      }),
    });

    if (!res.ok || !res.body) {
      if (res.status === 402) throw new Error("AI credits have run out. Add credits to keep using summaries.");
      if (res.status === 429) throw new Error("Too many requests right now. Try again in a minute.");
      throw new Error(`Couldn't summarize right now (${res.status}).`);
    }

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    let text = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const ev = JSON.parse(payload);
          if (ev.type === "response.output_text.delta") text += ev.delta ?? "";
        } catch {
          /* ignore partial */
        }
      }
    }
    return { summary: text.trim() || "No clear shared themes came through this time." };
  });
