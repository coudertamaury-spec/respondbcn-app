import { useState, useEffect, useRef } from "react";

const BUSINESS_TYPES = [
  { id: "peluqueria", label: "Peluquería", emoji: "✂️" },
  { id: "dentista", label: "Dentista", emoji: "🦷" },
  { id: "restaurante", label: "Restaurante", emoji: "🍽️" },
  { id: "estetica", label: "Estética", emoji: "💆" },
  { id: "fisioterapia", label: "Fisioterapia", emoji: "🏃" },
  { id: "veterinaria", label: "Veterinaria", emoji: "🐾" },
];

const MESSAGE_TYPES = [
  { id: "reserva", label: "Reserva", icon: "📅" },
  { id: "reseña", label: "Pedir reseña", icon: "⭐" },
  { id: "confirmacion", label: "Confirmar cita", icon: "✅" },
  { id: "cancelacion", label: "Cancelación", icon: "❌" },
  { id: "recordatorio", label: "Recordatorio", icon: "🔔" },
];

const TONE_OPTIONS = [
  { id: "formal", label: "Formal" },
  { id: "amigable", label: "Amigable" },
  { id: "cercano", label: "Cercano" },
];

const CHANNEL_OPTIONS = [
  { id: "whatsapp", label: "WhatsApp", color: "#25D366" },
  { id: "email", label: "Email", color: "#4A90D9" },
  { id: "sms", label: "SMS", color: "#8B5CF6" },
  { id: "instagram", label: "Instagram", color: "#E1306C" },
];

const REVIEW_PLATFORMS = [
  { id: "google", label: "Google", icon: "🔍", color: "#4285F4", placeholder: "https://g.page/tu-negocio/review" },
  { id: "tripadvisor", label: "TripAdvisor", icon: "🦉", color: "#00AF87", placeholder: "https://tripadvisor.es/tu-negocio" },
  { id: "yelp", label: "Yelp", icon: "⭐", color: "#D32323", placeholder: "https://yelp.es/biz/tu-negocio" },
  { id: "facebook", label: "Facebook", icon: "👍", color: "#1877F2", placeholder: "https://facebook.com/tu-negocio/reviews" },
  { id: "booking", label: "Booking", icon: "🏨", color: "#003580", placeholder: "https://booking.com/tu-propiedad" },
];

const REVIEW_TIMING = [
  { id: "inmediato", label: "Justo al salir", desc: "En el momento del servicio" },
  { id: "1hora", label: "1h después", desc: "Cuando ya está en casa" },
  { id: "1dia", label: "Al día siguiente", desc: "Con la experiencia asentada" },
];

const SERVICE_EXAMPLES = {
  peluqueria: ["Corte y peinado", "Coloración / balayage", "Tratamiento capilar", "Manicura / pedicura"],
  dentista: ["Revisión y limpieza", "Empaste / endodoncia", "Ortodoncia", "Blanqueamiento"],
  restaurante: ["Cena / comida", "Menú degustación", "Celebración especial", "Brunch"],
  estetica: ["Masaje / facial", "Depilación láser", "Mesoterapia", "Tratamiento corporal"],
  fisioterapia: ["Sesión de rehabilitación", "Alta clínica", "Tratamiento de lesión", "Revisión post-op"],
  veterinaria: ["Vacunación anual", "Consulta / revisión", "Cirugía", "Desparasitación"],
};

const DEMO_MESSAGES = {
  peluqueria: {
    reserva: "Hola! Quisiera reservar una cita para corte y tinte para el próximo sábado por la mañana. Gracias",
    reseña: "[Post-servicio] La clienta Marina García acaba de terminar su cita de balayage.",
    confirmacion: "Recordar cita de Juan López mañana jueves a las 11h para corte.",
    cancelacion: "Hola, tengo que cancelar mi cita de mañana a las 10h. Lo siento!",
    recordatorio: "Cita pendiente de confirmar: Pedro Ruiz, viernes 14h, coloración.",
  },
  dentista: {
    reserva: "Buenos días, necesito pedir cita para una revisión y limpieza dental. ¿Tienen hueco esta semana?",
    reseña: "[Post-visita] La paciente Ana Fernández completó su tratamiento de ortodoncia hoy.",
    confirmacion: "Confirmar cita de Carlos Martín para empaste mañana a las 9:30h.",
    cancelacion: "Necesito cancelar mi cita del lunes. Ha surgido algo urgente en el trabajo.",
    recordatorio: "Revisión anual pendiente: Laura Sánchez, última visita hace 11 meses.",
  },
  restaurante: {
    reserva: "Buenas tardes! Queremos reservar mesa para 6 personas el sábado 21 a las 21:30h. ¿Es posible?",
    reseña: "[Post-cena] La mesa de 4 personas del Sr. Gómez terminó su cena hace 30 minutos.",
    confirmacion: "Confirmar reserva de cumpleaños de familia Torres, domingo 15h, 8 personas.",
    cancelacion: "Hola, lamentablemente tenemos que cancelar la reserva de esta noche. Disculpen.",
    recordatorio: "Reserva sin confirmar: Mesa García, mañana sábado 21h, 4 personas.",
  },
  estetica: {
    reserva: "Me gustaría reservar una sesión de masaje y tratamiento facial. ¿Cuándo tienen disponibilidad?",
    reseña: "[Post-sesión] Sofía Llopis terminó su tratamiento de mesoterapia esta tarde.",
    confirmacion: "Confirmar sesión de depilación láser de Rosa Puig, martes 16h.",
    cancelacion: "Hola, no podré ir a mi cita de mañana. ¿Puedo cambiarla para la semana que viene?",
    recordatorio: "Tratamiento de 4 sesiones: Elena Mas tiene 2 sesiones restantes.",
  },
  fisioterapia: {
    reserva: "Tengo dolor lumbar desde hace una semana. ¿Puedo pedir cita urgente con el fisio?",
    reseña: "[Alta clínica] El paciente Antonio Vidal completó su tratamiento de 8 sesiones.",
    confirmacion: "Confirmar sesión de rehabilitación de hombro de Miguel Torres, mañana 10h.",
    cancelacion: "Hola, me encuentro con fiebre hoy. Tengo que cancelar mi sesión de esta tarde.",
    recordatorio: "Seguimiento post-lesión: Marta Ros, 3 semanas desde última visita.",
  },
  veterinaria: {
    reserva: "Buenos días, necesito cita para la vacuna anual de mi perro labrador de 3 años.",
    reseña: "[Post-consulta] El gato Misu de la familia Pons recibió sus vacunas esta mañana.",
    confirmacion: "Confirmar revisión post-operatoria de Toby, golden retriever de Sra. Alba, mañana 11h.",
    cancelacion: "Hola, mi perro ya se encuentra mejor, así que cancelo la cita de urgencias.",
    recordatorio: "Vacuna antirrábica pendiente: Rocky (pastor alemán) de Juan Camps, vence en 15 días.",
  },
};

const SYSTEM_PROMPT = (businessType, tone, channel) => `Eres el asistente de comunicación de un negocio de tipo "${businessType}" en Barcelona. 

Tu tarea es generar respuestas profesionales en español (castellano natural de España, usando "vosotros" cuando sea natural) para mensajes de clientes relacionados con reservas, reseñas, confirmaciones, cancelaciones o recordatorios.

Tono: ${tone === "formal" ? "Formal y profesional" : tone === "amigable" ? "Amigable y cálido" : "Cercano y coloquial, como si fuera un amigo del barrio"}.
Canal: ${channel === "whatsapp" ? "WhatsApp (breve, natural, puede usar 1-2 emojis)" : channel === "email" ? "Email (estructurado, con saludo y despedida formales)" : channel === "sms" ? "SMS (muy breve, máximo 2 frases, sin emojis)" : "Instagram DM (informal, moderno, máximo 3 líneas)"}.

Reglas importantes:
- Si es una RESERVA: confirma disponibilidad con entusiasmo y pide los datos necesarios (fecha, hora, servicio, nombre).
- Si es para PEDIR RESEÑA: hazlo de forma genuina, sin parecer spam. Incluye el enlace tal como aparezca en el contexto o usa [enlace de reseña].
- Si es CONFIRMACIÓN: confirma claramente la cita con todos los detalles.
- Si es CANCELACIÓN: responde con comprensión y ofrece reagendar.
- Si es RECORDATORIO: redacta un recordatorio amable con fecha y hora.
- Usa el nombre del cliente si aparece en el mensaje.
- Sé conciso pero completo. No escribas más de lo necesario para el canal.
- NO expliques lo que estás haciendo. Solo devuelve el mensaje listo para enviar.`;

const REVIEW_SYSTEM_PROMPT = (businessType, businessName, tone, channel, platform, timing) =>
  `Eres el asistente de comunicación de ${businessName ? `"${businessName}"` : `un negocio de tipo "${businessType}"`} en Barcelona.

Genera UN ÚNICO mensaje post-servicio para pedir una reseña al cliente de forma genuina y natural. 

Tono: ${tone === "formal" ? "Formal y profesional" : tone === "amigable" ? "Amigable y cálido" : "Cercano y coloquial, como si fuera un amigo del barrio"}.
Canal: ${channel === "whatsapp" ? "WhatsApp (natural, puede usar 1-2 emojis, máximo 4 líneas)" : channel === "email" ? "Email (con asunto en la primera línea precedido de 'Asunto:', luego el cuerpo del email)" : channel === "sms" ? "SMS (muy conciso, máximo 2 frases, sin emojis, incluir enlace)" : "Instagram DM (informal y breve, máximo 3 líneas)"}.
Plataforma de reseña: ${platform}.
Momento de envío: ${timing === "inmediato" ? "justo cuando el cliente acaba de terminar el servicio y está saliendo" : timing === "1hora" ? "aproximadamente 1 hora después de haber recibido el servicio, cuando ya está en casa" : "al día siguiente, con la experiencia ya asentada"}.

Reglas críticas:
- El mensaje debe sentirse PERSONAL y GENUINO, no como spam corporativo.
- NO uses frases genéricas como "nos importa mucho tu opinión". Sé específico.
- Menciona el servicio concreto si aparece en el contexto.
- Incluye el enlace exactamente como: [ENLACE_RESEÑA] (este placeholder será sustituido).
- Agradece de antemano de forma breve y natural.
- Si es email, empieza con "Asunto: " en la primera línea.
- Solo devuelve el mensaje listo para enviar, sin explicaciones.`;

export default function ResponBCN() {
  const [activeTab, setActiveTab] = useState("generator");
  const [selectedBusiness, setSelectedBusiness] = useState("peluqueria");
  const [selectedType, setSelectedType] = useState("reserva");
  const [selectedTone, setSelectedTone] = useState("amigable");
  const [selectedChannel, setSelectedChannel] = useState("whatsapp");
  const [inputMessage, setInputMessage] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [streamedText, setStreamedText] = useState("");

  // Review module state
  const [reviewClientName, setReviewClientName] = useState("");
  const [reviewService, setReviewService] = useState("");
  const [reviewPlatform, setReviewPlatform] = useState("google");
  const [reviewLink, setReviewLink] = useState("");
  const [reviewTiming, setReviewTiming] = useState("inmediato");
  const [reviewTone, setReviewTone] = useState("amigable");
  const [reviewChannel, setReviewChannel] = useState("whatsapp");
  const [reviewBusiness, setReviewBusiness] = useState("peluqueria");
  const [reviewGenerated, setReviewGenerated] = useState("");
  const [reviewStreamed, setReviewStreamed] = useState("");
  const [reviewGenerating, setReviewGenerating] = useState(false);
  const [reviewCopied, setReviewCopied] = useState(false);
  const [reviewVariants, setReviewVariants] = useState([]);
  const [activeVariant, setActiveVariant] = useState(0);

  const currentBusiness = BUSINESS_TYPES.find(b => b.id === selectedBusiness);
  const currentReviewBusiness = BUSINESS_TYPES.find(b => b.id === reviewBusiness);

  useEffect(() => {
    const demo = DEMO_MESSAGES[selectedBusiness]?.[selectedType] || "";
    setInputMessage(demo);
    setGeneratedReply("");
    setStreamedText("");
  }, [selectedBusiness, selectedType]);

  const generateReply = async () => {
    if (!inputMessage.trim()) return;
    setIsGenerating(true);
    setGeneratedReply("");
    setStreamedText("");

    const businessLabel = BUSINESS_TYPES.find(b => b.id === selectedBusiness)?.label || selectedBusiness;
    const businessContext = businessName ? `El negocio se llama "${businessName}".` : "";

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_tokens: 1000,
          system: SYSTEM_PROMPT(businessLabel, selectedTone, selectedChannel) + (businessContext ? `\n\n${businessContext}` : ""),
          messages: [{ role: "user", content: inputMessage }],
             originalReview: inputMessage,
          channel: selectedChannel,
          language: "es",
        }),
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || "No se pudo generar la respuesta.";

      setStreamedText("");
      let i = 0;
      const interval = setInterval(() => {
        if (i < reply.length) {
          setStreamedText(prev => prev + reply[i]);
          i++;
        } else {
          clearInterval(interval);
          setGeneratedReply(reply);
          setStreamedText("");
          setHistory(prev => [{
            id: Date.now(),
            business: selectedBusiness,
            type: selectedType,
            channel: selectedChannel,
            input: inputMessage,
            output: reply,
            tone: selectedTone,
            timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
          }, ...prev.slice(0, 9)]);
          setIsGenerating(false);
        }
      }, 12);

    } catch (err) {
      setGeneratedReply("Error al conectar con el servicio. Por favor, inténtalo de nuevo.");
      setIsGenerating(false);
    }
  };

  const generateReviewMessage = async (variantIndex = 0) => {
    setReviewGenerating(true);
    setReviewGenerated("");
    setReviewStreamed("");

    const bizLabel = BUSINESS_TYPES.find(b => b.id === reviewBusiness)?.label || reviewBusiness;
    const platLabel = REVIEW_PLATFORMS.find(p => p.id === reviewPlatform)?.label || reviewPlatform;
    const linkToUse = reviewLink || REVIEW_PLATFORMS.find(p => p.id === reviewPlatform)?.placeholder || "[ENLACE_RESEÑA]";

    const userPrompt = [
      reviewClientName && `Cliente: ${reviewClientName}`,
      reviewService && `Servicio realizado: ${reviewService}`,
      `Pide que deje una reseña en ${platLabel}.`,
      `Enlace: ${linkToUse}`,
      variantIndex > 0 && `Genera una variante diferente (opción ${variantIndex + 1}), con un enfoque distinto al habitual.`,
    ].filter(Boolean).join("\n");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_tokens: 600,
          system: REVIEW_SYSTEM_PROMPT(bizLabel, businessName, reviewTone, reviewChannel, platLabel, reviewTiming),
          messages: [{ role: "user", content: userPrompt }],
            originalReview: userPrompt,
          channel: reviewChannel,
          language: "es",
        }),
      });

      const data = await response.json();
      let reply = data.content?.[0]?.text || "No se pudo generar el mensaje.";
      // Replace placeholder with real link
      if (reviewLink) reply = reply.replace("[ENLACE_RESEÑA]", reviewLink);

      setReviewStreamed("");
      let i = 0;
      const interval = setInterval(() => {
        if (i < reply.length) {
          setReviewStreamed(prev => prev + reply[i]);
          i++;
        } else {
          clearInterval(interval);
          setReviewGenerated(reply);
          setReviewStreamed("");
          setReviewVariants(prev => {
            const updated = [...prev];
            updated[variantIndex] = reply;
            return updated;
          });
          setActiveVariant(variantIndex);
          setReviewGenerating(false);
          setHistory(prev => [{
            id: Date.now(),
            business: reviewBusiness,
            type: "reseña",
            channel: reviewChannel,
            input: `Post-servicio: ${reviewService || "servicio"} — ${reviewClientName || "cliente"}`,
            output: reply,
            tone: reviewTone,
            timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
          }, ...prev.slice(0, 9)]);
        }
      }, 14);

    } catch (err) {
      setReviewGenerated("Error al conectar. Inténtalo de nuevo.");
      setReviewGenerating(false);
    }
  };

  const copyToClipboard = (text, setter) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const displayText = streamedText || generatedReply;
  const reviewDisplayText = reviewStreamed || (reviewVariants[activeVariant] || reviewGenerated);
  const currentPlatform = REVIEW_PLATFORMS.find(p => p.id === reviewPlatform);

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", backgroundColor: "#F8F6F1", minHeight: "100vh", color: "#1B3A6B" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F8F6F1; }
        ::-webkit-scrollbar-thumb { background: #C9A96E; border-radius: 3px; }
        textarea:focus, input:focus, select:focus { outline: none; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes starPop { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
        .fade-in { animation: fadeIn 0.3s ease forwards; }
        .cursor::after { content:'|'; animation: blink 0.7s infinite; color: #C9A96E; }
        .btn-primary { background: #1B3A6B; color: white; border: none; border-radius: 10px; padding: 12px 24px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .btn-primary:hover:not(:disabled) { background: #152d54; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(27,58,107,0.25); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .btn-gold { background: linear-gradient(135deg, #C9A96E 0%, #B8912A 100%); color: white; border: none; border-radius: 10px; padding: 12px 24px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .btn-gold:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(201,169,110,0.4); }
        .btn-gold:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .btn-secondary { background: white; color: #1B3A6B; border: 2px solid #1B3A6B; border-radius: 10px; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .btn-secondary:hover { background: #1B3A6B; color: white; }
        .chip { border-radius: 20px; padding: 7px 16px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; font-family: inherit; white-space: nowrap; }
        .chip-active { background: #1B3A6B; color: white; }
        .chip-inactive { background: white; color: #1B3A6B; border-color: #dde3f0; }
        .chip-inactive:hover { border-color: #1B3A6B; }
        .chip-gold-active { background: linear-gradient(135deg, #C9A96E, #B8912A); color: white; }
        .chip-gold-inactive { background: white; color: #8B6914; border-color: #e8d5a3; }
        .chip-gold-inactive:hover { border-color: #C9A96E; }
        .card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 8px rgba(27,58,107,0.06); }
        .section-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #7B90B8; margin-bottom: 10px; }
        .review-platform-btn { border-radius: 10px; padding: 10px 14px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; font-family: inherit; display: flex; align-items: center; gap: 6px; }
        .star-anim { animation: starPop 0.4s ease forwards; }
        input[type=text], input[type=url], textarea, select { transition: border 0.2s; }
      `}</style>

      {/* Header */}
      <header style={{ background: "white", borderBottom: "1px solid #E8EDF5", padding: "0 24px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 6px rgba(27,58,107,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #1B3A6B 0%, #2D5FA8 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💬</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, lineHeight: 1, color: "#1B3A6B" }}>RespondBCN</div>
              <div style={{ fontSize: 11, color: "#7B90B8", letterSpacing: "0.05em" }}>Respuestas inteligentes para tu negocio</div>
            </div>
          </div>
          <nav style={{ display: "flex", gap: 4 }}>
            {[
              { id: "generator", label: "✦ Generador" },
              { id: "reviews", label: "⭐ Pedir reseñas" },
              { id: "historial", label: "⏱ Historial" },
              { id: "guia", label: "📖 Guía" },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                background: activeTab === tab.id ? (tab.id === "reviews" ? "#FDF6EC" : "#F0F4FA") : "transparent",
                border: "none", borderRadius: 8, padding: "8px 16px",
                fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 500,
                color: activeTab === tab.id ? (tab.id === "reviews" ? "#B8912A" : "#1B3A6B") : "#7B90B8",
                cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
              }}>{tab.label}</button>
            ))}
          </nav>
          <div style={{ fontSize: 12, color: "#7B90B8", background: "#F0F4FA", padding: "6px 14px", borderRadius: 20, fontWeight: 500 }}>
            🌐 Barcelona & alrededores
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* ── GENERADOR TAB ── */}
        {activeTab === "generator" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="card">
                <div className="section-label">Nombre de tu negocio (opcional)</div>
                <input value={businessName} onChange={e => setBusinessName(e.target.value)}
                  placeholder="Ej: Perruqueria Montserrat, Clínica Dental Eixample..."
                  style={{ width: "100%", padding: "12px 14px", border: "2px solid #E8EDF5", borderRadius: 10, fontSize: 14, color: "#1B3A6B", fontFamily: "inherit", background: "#FAFBFD" }}
                  onFocus={e => e.target.style.border = "2px solid #1B3A6B"}
                  onBlur={e => e.target.style.border = "2px solid #E8EDF5"} />
              </div>
              <div className="card">
                <div className="section-label">Tipo de negocio</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {BUSINESS_TYPES.map(b => (
                    <button key={b.id} onClick={() => setSelectedBusiness(b.id)} className={`chip ${selectedBusiness === b.id ? "chip-active" : "chip-inactive"}`}>
                      {b.emoji} {b.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="section-label">Tipo de mensaje</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {MESSAGE_TYPES.map(t => (
                    <button key={t.id} onClick={() => setSelectedType(t.id)} className={`chip ${selectedType === t.id ? "chip-active" : "chip-inactive"}`}>
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="card">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div>
                    <div className="section-label">Tono</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {TONE_OPTIONS.map(t => (
                        <button key={t.id} onClick={() => setSelectedTone(t.id)} style={{ background: selectedTone === t.id ? "#EEF2FA" : "transparent", border: `2px solid ${selectedTone === t.id ? "#1B3A6B" : "#E8EDF5"}`, borderRadius: 8, padding: "8px 12px", textAlign: "left", fontSize: 13, fontWeight: selectedTone === t.id ? 600 : 400, color: "#1B3A6B", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="section-label">Canal</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {CHANNEL_OPTIONS.map(c => (
                        <button key={c.id} onClick={() => setSelectedChannel(c.id)} style={{ background: selectedChannel === c.id ? "#EEF2FA" : "transparent", border: `2px solid ${selectedChannel === c.id ? "#1B3A6B" : "#E8EDF5"}`, borderRadius: 8, padding: "8px 12px", textAlign: "left", fontSize: 13, fontWeight: selectedChannel === c.id ? 600 : 400, color: "#1B3A6B", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0 }} />{c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="section-label">Mensaje del cliente / situación</div>
                <textarea value={inputMessage} onChange={e => setInputMessage(e.target.value)}
                  placeholder="Escribe el mensaje recibido o describe la situación..." rows={4}
                  style={{ width: "100%", padding: "12px 14px", border: "2px solid #E8EDF5", borderRadius: 10, fontSize: 14, color: "#1B3A6B", resize: "vertical", fontFamily: "inherit", background: "#FAFBFD", lineHeight: 1.6 }}
                  onFocus={e => e.target.style.border = "2px solid #1B3A6B"}
                  onBlur={e => e.target.style.border = "2px solid #E8EDF5"} />
                <button className="btn-primary" onClick={generateReply} disabled={isGenerating || !inputMessage.trim()} style={{ width: "100%", marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {isGenerating ? "⏳ Generando respuesta..." : "✦ Generar respuesta con IA"}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 88 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ background: "#EEF2FA", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#1B3A6B" }}>{currentBusiness?.emoji} {currentBusiness?.label}</div>
                <div style={{ background: "#FDF6EC", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#C9A96E" }}>{CHANNEL_OPTIONS.find(c => c.id === selectedChannel)?.label}</div>
                <div style={{ background: "#EDF7F2", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#2D7A5F" }}>Tono {TONE_OPTIONS.find(t => t.id === selectedTone)?.label}</div>
              </div>
              <div className="card" style={{ minHeight: 280 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div className="section-label" style={{ margin: 0 }}>Respuesta generada</div>
                  {displayText && (
                    <button onClick={() => copyToClipboard(displayText, setCopied)} style={{ background: copied ? "#EDF7F2" : "#F0F4FA", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: copied ? "#2D7A5F" : "#1B3A6B", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                      {copied ? "✓ Copiado!" : "📋 Copiar"}
                    </button>
                  )}
                </div>
                {!displayText && !isGenerating && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200, gap: 12, color: "#B0BDDA" }}>
                    <div style={{ fontSize: 40 }}>💬</div>
                    <div style={{ fontSize: 14, textAlign: "center", lineHeight: 1.5 }}>Configura el tipo de negocio,<br />mensaje y canal, y genera tu respuesta.</div>
                  </div>
                )}
                {displayText && (
                  <div className="fade-in" style={{ background: "#F8FAFE", border: "2px solid #E8EDF5", borderRadius: 12, padding: "16px 18px", fontSize: 15, lineHeight: 1.7, color: "#1B3A6B", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    <span className={isGenerating ? "cursor" : ""}>{displayText}</span>
                  </div>
                )}
              </div>
              {generatedReply && (
                <div className="card fade-in" style={{ background: "#FDF6EC", border: "1px solid #F0E0C0" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#C9A96E", marginBottom: 8 }}>💡 Consejo para {CHANNEL_OPTIONS.find(c => c.id === selectedChannel)?.label}</div>
                  <div style={{ fontSize: 13, color: "#7B6040", lineHeight: 1.5 }}>
                    {selectedChannel === "whatsapp" && "Pega este mensaje en WhatsApp Business. Puedes guardarlo como respuesta rápida."}
                    {selectedChannel === "email" && "Añade el asunto antes de enviar. Considera añadir tu firma con logo y datos."}
                    {selectedChannel === "sms" && "Verifica que el mensaje no supere 160 caracteres para evitar SMS doble."}
                    {selectedChannel === "instagram" && "Responde desde Instagram Business para acceder a estadísticas de respuesta."}
                  </div>
                </div>
              )}
              {generatedReply && (
                <div className="fade-in" style={{ display: "flex", gap: 10 }}>
                  <button className="btn-secondary" onClick={generateReply} style={{ flex: 1, fontSize: 13 }}>🔄 Regenerar</button>
                  <button className="btn-secondary" onClick={() => { setSelectedTone(prev => { const t = ["formal","amigable","cercano"]; return t[(t.indexOf(prev)+1)%3]; }); setTimeout(generateReply, 150); }} style={{ flex: 1, fontSize: 13 }}>🎭 Cambiar tono</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── REVIEWS TAB ── */}
        {activeTab === "reviews" && (
          <div>
            {/* Hero banner */}
            <div style={{ background: "linear-gradient(135deg, #1B3A6B 0%, #2D5FA8 100%)", borderRadius: 20, padding: "32px 36px", marginBottom: 28, color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
              <div>
                <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                  {[1,2,3,4,5].map(i => <span key={i} className="star-anim" style={{ fontSize: 22, animationDelay: `${i*0.08}s` }}>⭐</span>)}
                </div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
                  Solicita reseñas post-servicio
                </h2>
                <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.6, maxWidth: 480 }}>
                  El momento perfecto para pedir una reseña es justo después de que el cliente haya vivido una buena experiencia. La IA genera el mensaje ideal según el canal, el tono y el servicio recibido.
                </p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 16, padding: "20px 24px", textAlign: "center", minWidth: 160 }}>
                <div style={{ fontSize: 36, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>+34%</div>
                <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>más reseñas con<br />mensajes personalizados</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
              {/* LEFT — Review config */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Business */}
                <div className="card">
                  <div className="section-label">Tipo de negocio</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {BUSINESS_TYPES.map(b => (
                      <button key={b.id} onClick={() => { setReviewBusiness(b.id); setReviewService(""); }} className={`chip ${reviewBusiness === b.id ? "chip-active" : "chip-inactive"}`}>
                        {b.emoji} {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Client + Service */}
                <div className="card">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <div className="section-label">Nombre del cliente</div>
                      <input value={reviewClientName} onChange={e => setReviewClientName(e.target.value)}
                        placeholder="Ej: María, Sr. García..."
                        style={{ width: "100%", padding: "11px 13px", border: "2px solid #E8EDF5", borderRadius: 10, fontSize: 14, color: "#1B3A6B", fontFamily: "inherit", background: "#FAFBFD" }}
                        onFocus={e => e.target.style.border = "2px solid #1B3A6B"}
                        onBlur={e => e.target.style.border = "2px solid #E8EDF5"} />
                    </div>
                    <div>
                      <div className="section-label">Servicio realizado</div>
                      <select value={reviewService} onChange={e => setReviewService(e.target.value)}
                        style={{ width: "100%", padding: "11px 13px", border: "2px solid #E8EDF5", borderRadius: 10, fontSize: 14, color: reviewService ? "#1B3A6B" : "#A0AECE", fontFamily: "inherit", background: "#FAFBFD", cursor: "pointer", appearance: "none" }}
                        onFocus={e => e.target.style.border = "2px solid #1B3A6B"}
                        onBlur={e => e.target.style.border = "2px solid #E8EDF5"}>
                        <option value="">Selecciona servicio...</option>
                        {(SERVICE_EXAMPLES[reviewBusiness] || []).map(s => <option key={s} value={s}>{s}</option>)}
                        <option value="otro">Otro (personalizado)</option>
                      </select>
                    </div>
                  </div>
                  {reviewService === "otro" && (
                    <input value={""} onChange={e => setReviewService(e.target.value)}
                      placeholder="Describe el servicio realizado..."
                      style={{ width: "100%", marginTop: 10, padding: "11px 13px", border: "2px solid #C9A96E", borderRadius: 10, fontSize: 14, color: "#1B3A6B", fontFamily: "inherit", background: "#FAFBFD" }} />
                  )}
                </div>

                {/* Platform */}
                <div className="card">
                  <div className="section-label">Plataforma de reseña</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
                    {REVIEW_PLATFORMS.map(p => (
                      <button key={p.id} onClick={() => setReviewPlatform(p.id)}
                        className="review-platform-btn"
                        style={{ background: reviewPlatform === p.id ? p.color : "white", color: reviewPlatform === p.id ? "white" : "#4A5A7A", borderColor: reviewPlatform === p.id ? p.color : "#E8EDF5", justifyContent: "center" }}>
                        <span>{p.icon}</span> {p.label}
                      </button>
                    ))}
                  </div>
                  <div className="section-label">Enlace directo a reseñas</div>
                  <input value={reviewLink} onChange={e => setReviewLink(e.target.value)}
                    placeholder={currentPlatform?.placeholder || "https://..."}
                    type="url"
                    style={{ width: "100%", padding: "11px 13px", border: "2px solid #E8EDF5", borderRadius: 10, fontSize: 13, color: "#1B3A6B", fontFamily: "inherit", background: "#FAFBFD" }}
                    onFocus={e => e.target.style.border = "2px solid #1B3A6B"}
                    onBlur={e => e.target.style.border = "2px solid #E8EDF5"} />
                  <div style={{ fontSize: 11, color: "#A0AECE", marginTop: 6 }}>
                    {!reviewLink && "Si dejas el enlace vacío se usará un placeholder que puedes sustituir después."}
                    {reviewLink && "✓ Enlace personalizado — se incluirá en el mensaje generado."}
                  </div>
                </div>

                {/* Timing */}
                <div className="card">
                  <div className="section-label">¿Cuándo enviar el mensaje?</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {REVIEW_TIMING.map(t => (
                      <button key={t.id} onClick={() => setReviewTiming(t.id)} style={{ background: reviewTiming === t.id ? "#FDF6EC" : "transparent", border: `2px solid ${reviewTiming === t.id ? "#C9A96E" : "#E8EDF5"}`, borderRadius: 10, padding: "10px 14px", textAlign: "left", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 14, fontWeight: reviewTiming === t.id ? 600 : 400, color: reviewTiming === t.id ? "#B8912A" : "#1B3A6B" }}>{t.label}</span>
                        <span style={{ fontSize: 12, color: "#A0AECE" }}>{t.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone + Channel */}
                <div className="card">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div>
                      <div className="section-label">Tono</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {TONE_OPTIONS.map(t => (
                          <button key={t.id} onClick={() => setReviewTone(t.id)} style={{ background: reviewTone === t.id ? "#FDF6EC" : "transparent", border: `2px solid ${reviewTone === t.id ? "#C9A96E" : "#E8EDF5"}`, borderRadius: 8, padding: "8px 12px", textAlign: "left", fontSize: 13, fontWeight: reviewTone === t.id ? 600 : 400, color: reviewTone === t.id ? "#B8912A" : "#1B3A6B", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="section-label">Canal</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {CHANNEL_OPTIONS.map(c => (
                          <button key={c.id} onClick={() => setReviewChannel(c.id)} style={{ background: reviewChannel === c.id ? "#FDF6EC" : "transparent", border: `2px solid ${reviewChannel === c.id ? "#C9A96E" : "#E8EDF5"}`, borderRadius: 8, padding: "8px 12px", textAlign: "left", fontSize: 13, fontWeight: reviewChannel === c.id ? 600 : 400, color: "#1B3A6B", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0 }} />{c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <button className="btn-gold" onClick={() => { setReviewVariants([]); setActiveVariant(0); generateReviewMessage(0); }} disabled={reviewGenerating} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {reviewGenerating ? "⏳ Generando mensaje..." : "⭐ Generar mensaje de reseña"}
                </button>
              </div>

              {/* RIGHT — Review output */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 88 }}>

                {/* Context badges */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ background: "#EEF2FA", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#1B3A6B" }}>{currentReviewBusiness?.emoji} {currentReviewBusiness?.label}</div>
                  <div style={{ background: currentPlatform ? currentPlatform.color + "18" : "#FDF6EC", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: currentPlatform?.color || "#C9A96E" }}>{currentPlatform?.icon} {currentPlatform?.label}</div>
                  <div style={{ background: "#FDF6EC", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#C9A96E" }}>{CHANNEL_OPTIONS.find(c => c.id === reviewChannel)?.label}</div>
                </div>

                {/* Output */}
                <div className="card" style={{ minHeight: 260 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div className="section-label" style={{ margin: 0 }}>Mensaje generado</div>
                    {reviewDisplayText && (
                      <button onClick={() => copyToClipboard(reviewDisplayText, setReviewCopied)} style={{ background: reviewCopied ? "#EDF7F2" : "#FDF6EC", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: reviewCopied ? "#2D7A5F" : "#B8912A", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                        {reviewCopied ? "✓ Copiado!" : "📋 Copiar"}
                      </button>
                    )}
                  </div>

                  {!reviewDisplayText && !reviewGenerating && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 180, gap: 12, color: "#B0BDDA" }}>
                      <div style={{ fontSize: 40 }}>⭐</div>
                      <div style={{ fontSize: 14, textAlign: "center", lineHeight: 1.5 }}>Completa los datos del cliente<br />y genera el mensaje de solicitud de reseña.</div>
                    </div>
                  )}

                  {reviewDisplayText && (
                    <div className="fade-in" style={{ background: "#FFFBF4", border: "2px solid #F0E0C0", borderRadius: 12, padding: "16px 18px", fontSize: 15, lineHeight: 1.7, color: "#1B3A6B", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                      <span className={reviewGenerating ? "cursor" : ""}>{reviewDisplayText}</span>
                    </div>
                  )}
                </div>

                {/* Variant selector */}
                {reviewVariants.length > 0 && (
                  <div className="card fade-in" style={{ padding: "16px 20px" }}>
                    <div className="section-label" style={{ marginBottom: 10 }}>Variantes generadas</div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                      {reviewVariants.map((_, i) => (
                        <button key={i} onClick={() => setActiveVariant(i)} style={{ flex: 1, padding: "8px", border: `2px solid ${activeVariant === i ? "#C9A96E" : "#E8EDF5"}`, borderRadius: 8, background: activeVariant === i ? "#FDF6EC" : "white", fontSize: 13, fontWeight: activeVariant === i ? 600 : 400, color: activeVariant === i ? "#B8912A" : "#7B90B8", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                          Opción {i + 1}
                        </button>
                      ))}
                      {reviewVariants.length < 3 && (
                        <button onClick={() => generateReviewMessage(reviewVariants.length)} disabled={reviewGenerating} style={{ flex: 1, padding: "8px", border: "2px dashed #E8EDF5", borderRadius: 8, background: "white", fontSize: 13, color: "#A0AECE", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                          + Nueva
                        </button>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "#A0AECE" }}>Genera hasta 3 variantes y elige la que mejor encaje con tu estilo.</div>
                  </div>
                )}

                {/* Link tip */}
                {reviewGenerated && !reviewLink && (
                  <div className="card fade-in" style={{ background: "#FEF9EC", border: "1px solid #F0E0A0", padding: "16px 18px" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#B8912A", marginBottom: 6 }}>⚠️ Recuerda sustituir el enlace</div>
                    <div style={{ fontSize: 13, color: "#7B6040", lineHeight: 1.5 }}>
                      El mensaje usa un enlace de ejemplo. Ve a <strong>Google Business Profile</strong> → "Obtener más reseñas" y pega tu URL real en el campo de arriba.
                    </div>
                  </div>
                )}

                {/* Channel send guide */}
                {reviewGenerated && (
                  <div className="card fade-in" style={{ background: "#F0F4FA", padding: "16px 18px" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#1B3A6B", marginBottom: 8 }}>📤 Cómo enviarlo por {CHANNEL_OPTIONS.find(c => c.id === reviewChannel)?.label}</div>
                    <div style={{ fontSize: 13, color: "#4A5A7A", lineHeight: 1.6 }}>
                      {reviewChannel === "whatsapp" && <>Abre WhatsApp Business → busca el contacto del cliente → pega el mensaje. Guárdalo como <strong>respuesta rápida</strong> con el atajo <code style={{ background: "#E8EDF5", padding: "1px 5px", borderRadius: 4 }}>/reseña</code> para usarlo siempre.</>}
                      {reviewChannel === "email" && <>El asunto aparece en la primera línea. Copia todo en tu gestor de email, adapta la firma y envíalo desde la dirección del negocio.</>}
                      {reviewChannel === "sms" && <>Envíalo desde tu plataforma de SMS marketing (Twilio, Vonage, etc.) o directamente desde el móvil del negocio. Ideal combinar con nombre del cliente.</>}
                      {reviewChannel === "instagram" && <>Responde el DM del cliente o abre una nueva conversación desde Instagram Business. Activa las respuestas rápidas en Configuración → Mensajes.</>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── HISTORIAL TAB ── */}
        {activeTab === "historial" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Historial de respuestas</h2>
              <p style={{ color: "#7B90B8", fontSize: 14 }}>Últimas {history.length} respuestas generadas en esta sesión</p>
            </div>
            {history.length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: 60, color: "#B0BDDA" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>⏱</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Sin historial todavía</div>
                <div style={{ fontSize: 13 }}>Genera tu primera respuesta en el Generador o en Pedir reseñas</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {history.map(item => {
                  const biz = BUSINESS_TYPES.find(b => b.id === item.business);
                  const ch = CHANNEL_OPTIONS.find(c => c.id === item.channel);
                  const type = MESSAGE_TYPES.find(t => t.id === item.type);
                  return (
                    <div key={item.id} className="card fade-in" style={{ borderLeft: `4px solid ${item.type === "reseña" ? "#C9A96E" : "#1B3A6B"}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ background: "#EEF2FA", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>{biz?.emoji} {biz?.label}</span>
                          <span style={{ background: item.type === "reseña" ? "#FDF6EC" : "#EEF2FA", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 600, color: item.type === "reseña" ? "#C9A96E" : "#1B3A6B" }}>{type?.icon} {type?.label}</span>
                          <span style={{ borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 600, color: "white", background: ch?.color }}>{ch?.label}</span>
                        </div>
                        <span style={{ fontSize: 12, color: "#B0BDDA" }}>{item.timestamp}</span>
                      </div>
                      <div style={{ fontSize: 13, color: "#7B90B8", marginBottom: 10, fontStyle: "italic" }}>"{item.input.substring(0, 100)}{item.input.length > 100 ? "..." : ""}"</div>
                      <div style={{ background: "#F8FAFE", borderRadius: 10, padding: "12px 14px", fontSize: 14, lineHeight: 1.6, color: "#1B3A6B", whiteSpace: "pre-wrap" }}>{item.output}</div>
                      <button onClick={() => navigator.clipboard.writeText(item.output)} style={{ marginTop: 10, background: "none", border: "none", fontSize: 12, color: "#7B90B8", cursor: "pointer", fontFamily: "inherit" }}>📋 Copiar respuesta</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── GUÍA TAB ── */}
        {activeTab === "guia" && (
          <div style={{ maxWidth: 700 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Guía de uso</h2>
            <p style={{ color: "#7B90B8", fontSize: 15, marginBottom: 32 }}>Cómo sacar el máximo provecho a RespondBCN</p>
            {[
              { icon: "⭐", title: "Estrategia de reseñas post-servicio", items: ["El mejor momento para pedir la reseña es justo al finalizar el servicio, mientras la experiencia está fresca.", "Personaliza siempre con el nombre del cliente y el servicio concreto: aumenta la tasa de respuesta un 60%.", "Para Google: ve a Google Business Profile → 'Obtener más reseñas' y copia el enlace directo. Es un único clic para el cliente.", "Genera 2-3 variantes y rota entre ellas para que los mensajes no suenen siempre igual."] },
              { icon: "✂️", title: "Para peluquerías y estéticas", items: ["Usa «Reserva» cuando un cliente pregunte por disponibilidad en Instagram o WhatsApp.", "Tras cada servicio, activa «Pedir reseña» con tono Cercano. El momento ideal: cuando la clienta todavía está en el local.", "Guarda las respuestas más usadas como respuestas rápidas en WhatsApp Business."] },
              { icon: "🦷", title: "Para clínicas dentales y fisioterapia", items: ["Usa «Confirmar cita» para reducir ausencias. Envía el recordatorio 24h antes.", "Para reseñas, espera al alta del paciente o al final de un tratamiento completado. Evita pedirlas en primeras visitas.", "Tono recomendado: Formal o Amigable. Evita «Cercano» en primeras consultas."] },
              { icon: "🍽️", title: "Para restaurantes y bares", items: ["Pide la reseña por SMS o WhatsApp al terminar la cena, cuando la experiencia está en su pico.", "Para grupos grandes, activa «Confirmación» 48h antes para evitar cancelaciones.", "Usa TripAdvisor para el turismo y Google para el barrio: adapta la plataforma al perfil del cliente."] },
            ].map((section, i) => (
              <div key={i} className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ fontSize: 28, flexShrink: 0, marginTop: 2 }}>{section.icon}</div>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{section.title}</h3>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                      {section.items.map((item, j) => (
                        <li key={j} style={{ fontSize: 14, color: "#4A5A7A", lineHeight: 1.6, display: "flex", gap: 8 }}>
                          <span style={{ color: "#C9A96E", fontWeight: 700, flexShrink: 0 }}>→</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
            <div className="card" style={{ background: "linear-gradient(135deg, #1B3A6B 0%, #2D5FA8 100%)", color: "white", marginTop: 8 }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>🚀</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>¿Quieres integrarlo en tu web o CRM?</h3>
              <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.6 }}>RespondBCN puede integrarse con WhatsApp Business API, email automático y tu sistema de reservas para enviar mensajes de reseña de forma totalmente automática al cerrar cada cita.</p>
              <div style={{ marginTop: 14, fontSize: 13, opacity: 0.7, fontWeight: 500 }}>📍 Servicio pensado para negocios del área metropolitana de Barcelona</div>
            </div>
          </div>
        )}
      </div>

      <footer style={{ marginTop: 60, padding: "24px", borderTop: "1px solid #E8EDF5", textAlign: "center", color: "#B0BDDA", fontSize: 12 }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#C9A96E", fontSize: 14 }}>RespondBCN</span>
        {"  ·  "}Respuestas inteligentes para pequeños y medianos negocios{"  ·  "}Barcelona & alrededores
      </footer>
    </div>
  );
}
