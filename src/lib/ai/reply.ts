export type AiMessage = { role: "system" | "user" | "assistant"; content: string };

export type AiReplyResult = {
  text: string;
  mode: "openai" | "anthropic" | "mock";
};

const MOCK_REPLIES: Array<{ match: RegExp; reply: string }> = [
  {
    match: /hola|buenos|buenas|hey/i,
    reply:
      "Hola, soy Luna de MAY-CODE. Estoy aqui para ayudarte con demos, servicios y soporte. En que te puedo ayudar hoy?",
  },
  {
    match: /precio|costo|cuanto|cotiz/i,
    reply:
      "El precio depende del alcance (canales, integraciones y volumen). Podemos armarte un plan piloto. Quieres que un asesor te envie una cotizacion?",
  },
  {
    match: /demo|prueba|agendar/i,
    reply:
      "Claro! Puedo agendarte una demo de 20 minutos. Te queda manana a las 10:00 o 16:00 (hora Lima)?",
  },
  {
    match: /whatsapp|meta|instagram/i,
    reply:
      "Luna Desk unifica WhatsApp, Instagram, Web, Email y Llamadas. Para WhatsApp: creas una app en Meta, configuras el webhook y verificas el token. Necesitas guia paso a paso?",
  },
  {
    match: /humano|persona|asesor|agente/i,
    reply:
      "Entendido. Te transfiero con un agente humano del equipo MAY-CODE. En un momento te atienden.",
  },
  {
    match: /horario|atencion|sla/i,
    reply:
      "Atendemos de lunes a viernes de 9:00 a 18:00 (America/Lima). Fuera de horario, yo respondo y un humano te contacta el siguiente dia habil.",
  },
  {
    match: /gracias|chau|adios/i,
    reply: "Con gusto! Si necesitas algo mas, aqui estare. Que tengas un excelente dia.",
  },
];

export function mockReply(userText: string, agentName = "Luna"): string {
  for (const rule of MOCK_REPLIES) {
    if (rule.match.test(userText)) return rule.reply.replace(/Luna/g, agentName);
  }
  return `Gracias por tu mensaje. Soy ${agentName} de MAY-CODE. Puedo ayudarte con demos, precios, integracion de canales o transferirte a un humano. Que necesitas?`;
}

export async function generateReply(opts: {
  systemPrompt: string;
  knowledgeMd?: string;
  history: AiMessage[];
  userMessage: string;
  agentName?: string;
}): Promise<AiReplyResult> {
  const system = [
    opts.systemPrompt,
    opts.knowledgeMd ? `\n\nBase de conocimiento:\n${opts.knowledgeMd}` : "",
    "\nResponde siempre en espanol (es-PE), breve y util.",
  ].join("");

  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (openaiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages: [
            { role: "system", content: system },
            ...opts.history,
            { role: "user", content: opts.userMessage },
          ],
          temperature: 0.6,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) return { text, mode: "openai" };
      }
    } catch {
      /* fall through to mock */
    }
  }

  if (anthropicKey) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest",
          max_tokens: 512,
          system,
          messages: [
            ...opts.history
              .filter((m) => m.role !== "system")
              .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
            { role: "user", content: opts.userMessage },
          ],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.content?.[0]?.text?.trim();
        if (text) return { text, mode: "anthropic" };
      }
    } catch {
      /* fall through */
    }
  }

  return { text: mockReply(opts.userMessage, opts.agentName), mode: "mock" };
}
