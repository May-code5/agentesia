import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.workspaceSettings.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workspace.deleteMany();

  const workspace = await prisma.workspace.create({
    data: {
      name: "MAY-CODE Demo",
      slug: "maycode-demo",
      timezone: "America/Lima",
      businessName: "MAY-CODE Studio",
      settings: {
        create: {
          webhookSecret: "demo-webhook-secret",
          openaiKeyHint: "",
          anthropicKeyHint: "",
          whatsappTokenHint: "",
        },
      },
    },
  });

  const passwordHash = await bcrypt.hash("demo1234", 10);
  await prisma.user.create({
    data: {
      email: "admin@maycode.pe",
      name: "Admin MAY-CODE",
      passwordHash,
      role: "admin",
      workspaceId: workspace.id,
    },
  });

  const agent = await prisma.agent.create({
    data: {
      workspaceId: workspace.id,
      name: "Luna",
      systemPrompt:
        "Eres Luna, la asistente virtual de atencion al cliente de MAY-CODE. Respondes en espanol peruano, de forma clara, calida y profesional. Ayudas con consultas sobre servicios de desarrollo de software, demos y soporte. Si el cliente pide hablar con un humano o expresa frustracion fuerte, ofreces transferir a un agente humano.",
      tone: "amigable",
      knowledgeMd: [
        "# FAQ MAY-CODE",
        "",
        "## Que es MAY-CODE?",
        "MAY-CODE es un estudio de software en Lima, Peru. Disenamos y construimos productos digitales, automatizaciones e IA para empresas.",
        "",
        "## Horario de atencion",
        "Lunes a viernes de 9:00 a 18:00 (America/Lima). Fuera de horario, Luna responde y un humano te contacta al siguiente dia habil.",
        "",
        "## Como pedir una demo?",
        "Escribe quiero una demo o visita maycodestudio.com. Un asesor te contactara en menos de 24 h.",
        "",
        "## Canales soportados",
        "WhatsApp, Instagram, Web, Email y Llamadas — todo en un solo inbox con Luna Desk.",
      ].join("\n"),
      enabledChannels: "WEB,WHATSAPP,INSTAGRAM,EMAIL,VOICE",
      handoffRules:
        "Transferir a humano si: 1) el cliente lo pide explicitamente, 2) menciona queja o reclamo formal, 3) pide factura o contrato legal, 4) Luna no puede resolver tras 3 intentos.",
      isActive: true,
    },
  });

  type Sample = {
    channel: string;
    contactName: string;
    contactHandle: string;
    subject?: string;
    status: string;
    messages: Array<{ body: string; senderType: string; senderName?: string; hoursAgo: number }>;
  };

  const samples: Sample[] = [
    {
      channel: "WHATSAPP",
      contactName: "Maria Quispe",
      contactHandle: "+51 999 111 222",
      status: "open",
      messages: [
        { body: "Hola, tienen disponibilidad para un proyecto de e-commerce?", senderType: "contact", hoursAgo: 5 },
        { body: "Hola Maria! Soy Luna de MAY-CODE. Si, trabajamos e-commerce a medida. Es una tienda nueva o una migracion?", senderType: "ai", senderName: "Luna", hoursAgo: 4.9 },
        { body: "Tienda nueva, con pagos en soles y envios a Lima.", senderType: "contact", hoursAgo: 4.5 },
      ],
    },
    {
      channel: "INSTAGRAM",
      contactName: "Carlos Rios",
      contactHandle: "@carlos.dev",
      status: "open",
      messages: [
        { body: "Vi su anuncio de Luna Desk, puedo pedir una demo?", senderType: "contact", hoursAgo: 3 },
        { body: "Claro Carlos! Puedo agendarte una demo de 20 min. Te queda manana a las 10:00 o 16:00 (Lima)?", senderType: "ai", senderName: "Luna", hoursAgo: 2.9 },
      ],
    },
    {
      channel: "WEB",
      contactName: "Visitante Web",
      contactHandle: "anon-web-01",
      subject: "Consulta widget",
      status: "open",
      messages: [
        { body: "Cuanto cuesta implementar el chatbot?", senderType: "contact", hoursAgo: 2 },
        { body: "Depende del alcance (canales, integraciones y volumen). El MVP suele partir desde un plan piloto. Quieres que un asesor te envie una cotizacion?", senderType: "ai", senderName: "Luna", hoursAgo: 1.9 },
      ],
    },
    {
      channel: "EMAIL",
      contactName: "Ana Torres",
      contactHandle: "ana.torres@empresa.pe",
      subject: "Soporte integracion WhatsApp",
      status: "pending",
      messages: [
        { body: "Buenas tardes, necesitamos ayuda para conectar Meta WhatsApp Business API a nuestro inbox.", senderType: "contact", hoursAgo: 8 },
        { body: "Hola Ana, gracias por escribir. Te guio: 1) Crea una app en Meta for Developers, 2) configura el webhook a /api/webhooks/whatsapp, 3) verifica el token. Ya tienes el Business Account?", senderType: "ai", senderName: "Luna", hoursAgo: 7.5 },
        { body: "Si, ya tenemos el WABA. Pueden acompanarnos en una llamada?", senderType: "contact", hoursAgo: 6 },
      ],
    },
  
    {
      channel: "VOICE",
      contactName: "Jose Mendoza",
      contactHandle: "+51 988 777 666",
      subject: "Llamada entrante",
      status: "closed",
      messages: [
        { body: "[Llamada] Consulta sobre horarios de soporte y SLA.", senderType: "contact", hoursAgo: 26 },
        { body: "Resumen: Jose pregunto por SLA 24/7. Se le explico horario 9-18 Lima y cobertura con Luna fuera de horario. Quedo conforme.", senderType: "human", senderName: "Admin MAY-CODE", hoursAgo: 25.5 },
      ],
    },
    {
      channel: "WHATSAPP",
      contactName: "Lucia Vargas",
      contactHandle: "+51 955 444 333",
      status: "open",
      messages: [
        { body: "Quiero hablar con una persona, por favor.", senderType: "contact", hoursAgo: 1 },
        { body: "Entendido, Lucia. Te transfiero con un agente humano. En un momento te atienden.", senderType: "ai", senderName: "Luna", hoursAgo: 0.95 },
        { body: "Hola Lucia, soy el equipo de MAY-CODE. En que te ayudamos?", senderType: "human", senderName: "Admin MAY-CODE", hoursAgo: 0.5 },
      ],
    },
    {
      channel: "INSTAGRAM",
      contactName: "Diego Palma",
      contactHandle: "@diegopalma",
      status: "open",
      messages: [
        { body: "Hacen apps moviles tambien?", senderType: "contact", hoursAgo: 12 },
        { body: "Si, desarrollamos apps iOS/Android (React Native / nativas segun el caso). Es B2C o app interna?", senderType: "ai", senderName: "Luna", hoursAgo: 11.8 },
      ],
    },
    {
      channel: "EMAIL",
      contactName: "Sofia Leon",
      contactHandle: "sofia@retail.pe",
      subject: "Renovacion licencia Luna Desk",
      status: "open",
      messages: [
        { body: "Hola, queremos renovar y sumar el canal de Instagram.", senderType: "contact", hoursAgo: 4 },
      ],
    },
  ];

  const now = Date.now();
  for (const s of samples) {
    const lastHours = Math.min(...s.messages.map((m) => m.hoursAgo));
    const conv = await prisma.conversation.create({
      data: {
        workspaceId: workspace.id,
        agentId: agent.id,
        channel: s.channel,
        status: s.status,
        subject: s.subject ?? null,
        contactName: s.contactName,
        contactHandle: s.contactHandle,
        lastMessageAt: new Date(now - lastHours * 3600_000),
      },
    });
    for (const m of [...s.messages].sort((a, b) => b.hoursAgo - a.hoursAgo)) {
      await prisma.message.create({
        data: {
          conversationId: conv.id,
          body: m.body,
          senderType: m.senderType,
          senderName: m.senderName ?? null,
          createdAt: new Date(now - m.hoursAgo * 3600_000),
        },
      });
    }
  }

  console.log("Seed listo: workspace MAY-CODE Demo, agente Luna, 8 conversaciones, admin@maycode.pe");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
