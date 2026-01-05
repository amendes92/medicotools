import { GoogleGenAI } from "@google/genai";
import { 
  analyzeSitePerformance, 
  searchMedicalPlaces, 
  checkSiteSecurity,
  analyzeImageContent,
  analyzeSentiment
} from "./externalApis";

// Inicializa o cliente Gemini usando a chave do ambiente
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- INTERFACE DOS DADOS DE ENTRADA ---
interface AuditRequest {
  doctorName: string;
  specialty: string;
  city: string;
  websiteUrl: string;
}

// --- FUNÇÃO DE TESTE DE CONEXÃO ---
export const testGeminiConnection = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Ping. Are you active?",
    });
    return response.text || "Sem resposta de texto.";
  } catch (error) {
    console.error("Test Connection Error:", error);
    throw new Error("Falha ao conectar com Gemini API.");
  }
};

// --- FUNÇÃO PRINCIPAL: O "ROBÔ" DE AUDITORIA ---
export const runOrthoAudit = async (request: AuditRequest): Promise<string> => {
  console.log("🚀 Iniciando Auditoria Completa para:", request.doctorName);

  // 1. COLETA DE DADOS PARALELA (APIs de Infraestrutura)
  const [pageSpeed, security, competitors] = await Promise.all([
    analyzeSitePerformance(request.websiteUrl),
    checkSiteSecurity(request.websiteUrl),
    searchMedicalPlaces(`${request.specialty} em ${request.city}`)
  ]);

  // 2. PROCESSAMENTO DE IMAGEM (Vision API)
  let visionLabels: string[] = ["Sem dados visuais"];
  let ocrText: string = "Texto da imagem não disponível";

  if (pageSpeed && pageSpeed.screenshot) {
      console.log("📸 Screenshot capturado. Enviando para Cloud Vision API...");
      try {
        visionLabels = await analyzeImageContent(pageSpeed.screenshot);
        // Em um cenário real, aqui também chamaríamos a detecção de texto (OCR) da Vision API
        ocrText = "Agende sua consulta. Especialista em Quadril."; // Simulação de OCR baseada no screenshot
      } catch (err) {
        console.error("Erro no processamento visual:", err);
      }
  }

  // 3. PROCESSAMENTO DE LINGUAGEM NATURAL (Sentiment Analysis)
  // Analisamos o "tom" do site baseado no texto OCR ou simulado
  let sentimentData = { score: 0, magnitude: 0 };
  try {
     sentimentData = await analyzeSentiment(ocrText);
  } catch (err) {
     console.warn("Skipping sentiment analysis due to error");
  }

  // 4. PREPARAÇÃO DO CONTEXTO (O "Prontuário" para a IA)
  const auditContext = {
    paciente: {
      nome: request.doctorName,
      site: request.websiteUrl,
      especialidade: request.specialty
    },
    sinaisVitais: {
      velocidadeMobile: pageSpeed ? pageSpeed.score : "Falha na medição",
      lcp: pageSpeed ? pageSpeed.lcp : "Indisponível",
      diagnosticoSeguranca: security // 'SEGURO' ou 'PERIGO'
    },
    exameVisual: {
      elementosDetectados: visionLabels.join(", "),
      analiseSentimento: `Score: ${sentimentData.score} (Tom ${sentimentData.score > 0 ? 'Positivo' : 'Negativo/Neutro'})`,
      obs: visionLabels.includes("Generic") ? "Imagens parecem banco de imagens" : "Imagens originais detectadas"
    },
    mercado: {
      concorrentesEncontrados: competitors.slice(0, 3).map((c: any) => ({
        nome: c.displayName?.text,
        nota: c.rating,
        reviews: c.userRatingCount
      }))
    }
  };

  console.log("📊 Dados Coletados (Contexto Completo):", auditContext);

  // 5. CHAMADA AO GEMINI (O Diagnóstico)
  const SYSTEM_PROMPT_ORTOAUDIT = `
**IDENTIDADE:** Você é o "OrtoAudit AI", autoridade mundial em Marketing Médico para Ortopedistas.
**OBJETIVO:** Analisar os dados JSON abaixo e gerar um "Relatório de Diagnóstico Digital" persuasivo.

**REGRAS DE OURO (METÁFORAS MÉDICAS OBRIGATÓRIAS):**
1. Site Lento (< 50) = "Paciente com mobilidade reduzida" ou "Articulação travada".
2. Site Rápido (> 90) = "Atleta de alta performance".
3. Site Inseguro = "Baixa imunidade" ou "Risco de infecção".
4. Elementos Visuais Genéricos/Sentimento Neutro = "Efeito Placebo" ou "Falta de identidade biológica".
5. Sem Reviews/Concorrência Alta = "Invisibilidade clínica" ou "Perda de território".

**ESTRUTURA DA RESPOSTA (Markdown):**

# 🩺 Prontuário Digital: Dr(a). [Nome]

## 1. A Triagem (Sinais Vitais do Site)
*Analise a velocidade (Score: [score]) e segurança. Seja alarmista se a nota for baixa.*

## 2. Exame de Imagem & Cognitivo (Vision & NLP)
*Vision API detectou: [elementos]. Natural Language detectou tom: [sentimento]. O site passa autoridade médica real ou parece genérico?*

## 3. Raio-X do Mercado (Comparativo)
*Compare o médico com os concorrentes listados no JSON. Use a frase: "Enquanto o senhor descansa, o [Nome Concorrente] está captando..."*

## 4. Diagnóstico e Tratamento
*Resuma o problema central e liste 3 ações corretivas imediatas (Ex: "Cirurgia de SEO", "Implante de Conteúdo").*

## 5. Prescrição (Google Ads)
*Crie 3 Títulos (Headlines) criativos para anúncios focados em dor/cirurgia para a especialidade dele.*
`;

  const prompt = `
    ${SYSTEM_PROMPT_ORTOAUDIT}
    
    --- DADOS DO PACIENTE (INPUT JSON) ---
    ${JSON.stringify(auditContext, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
    });
    return response.text || "Sem resposta da IA.";
  } catch (error) {
    console.error("❌ Erro na Geração IA:", error);
    return "Erro ao gerar o relatório. O sistema de IA está temporariamente indisponível.";
  }
};