import { GoogleGenAI } from "@google/genai";
import { AuditMetrics, AnalysisResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = "gemini-3-flash-preview";

export const testGeminiConnection = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Responda apenas com a palavra 'OK' se você estiver recebendo esta mensagem.",
    });
    
    if (!response.text) {
      throw new Error("Resposta vazia da API");
    }
    
    return response.text;
  } catch (error) {
    console.error("Connection Test Error:", error);
    throw error;
  }
};

const runPhase = async (systemInstruction: string, prompt: string, jsonMode: boolean = false): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: jsonMode ? "application/json" : "text/plain",
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return text;
  } catch (error) {
    console.error("Gemini Phase Error:", error);
    throw error;
  }
};

export const generateMedicalReport = async (metrics: AuditMetrics): Promise<AnalysisResult> => {
  
  // --- FASE 1: Triagem (Technical) ---
  const sysPhase1 = `Você é o "OrtoAudit AI", um consultor de elite em Marketing Médico especializado em Ortopedia e Traumatologia.
  Sua função é traduzir métricas de engenharia de software para a linguagem de um Cirurgião Ortopedista.
  
  DIRETRIZES DE TOM:
  - Fale de médico para médico. Seja "cirúrgico" nas críticas.
  - Nunca use jargão técnico sem explicá-lo com uma metáfora do corpo humano.
  
  METÁFORAS OBRIGATÓRIAS:
  - Site Lento (< 80) = "Paciente com mobilidade reduzida", "Articulação travada" ou "Artrose Digital".
  - Erro de Segurança = "Baixa Imunidade", "Risco de Infecção Hospitalar" ou "Ambiente Séptico".
  - UX Ruim no Celular = "Ambiente sem Acessibilidade" ou "Barreira Arquitetônica".
  - Core Web Vitals Ruim = "Sinais Vitais Instáveis".`;

  const promptPhase1 = `Analise os dados brutos da infraestrutura do site do Dr. ${metrics.doctorName}:
1. PageSpeed Mobile Score: ${metrics.pageSpeedScore}/100
2. Tempo de Carregamento (LCP): ${metrics.lcpTime}s
3. Web Risk API Status: ${metrics.webRiskStatus}
4. Core Web Vitals: ${metrics.coreWebVitals}

Gere um parágrafo de "Triagem Inicial".
Se a nota for baixa, seja alarmista mas profissional, como um médico alertando sobre um exame de sangue ruim ou risco cirúrgico.
IMPORTANTE: Retorne APENAS um objeto JSON com as chaves 'text' e 'severity' ("low"|"medium"|"high").`;


  // --- FASE 2: Exame Físico (Branding) ---
  const sysPhase2 = `Você é um Especialista em Semiótica Médica. Você analisa a "Imagem do Paciente" (O Site).
  
  CRITÉRIOS DE DIAGNÓSTICO:
  - Se as etiquetas (Vision API) contiverem "Generic", "Business", "Handshake", "Building": CRITIQUE SEVERAMENTE. Diga que parece um "Banco de Imagens Genérico" (Placebo Visual). Isso reduz a autoridade do cirurgião.
  - Se contiverem "Doctor", "Surgery", "Medical Equipment", "Hospital": ELOGIE. Isso é "Evidência Clínica" de autoridade.
  - O texto deve passar empatia e técnica.`;
  
  const promptPhase2 = `Analise o "Exame de Imagem" do site do Dr. ${metrics.doctorName}:
1. Rótulos das Imagens (Vision API): ${metrics.visionLabels}
2. OCR (Texto nas imagens): ${metrics.ocrText}
3. Análise de Sentimento (NLP): ${metrics.sentimentScore}
4. Entidades: ${metrics.nlpEntities}

Diagnostique a "Autoridade Percebida". O médico parece um especialista de ponta ou uma clínica genérica?
Retorne APENAS um objeto JSON com as chaves 'text' e 'severity' ("low"|"medium"|"high").`;


  // --- FASE 3: Raio-X do Mercado (Market) ---
  const sysPhase3 = `Você é um Estrategista de Guerra Cirúrgica.
  Seu objetivo é mostrar ao médico que ele está sofrendo uma "Hemorragia de Pacientes".
  Use o gatilho da "Perda de Território": Mostre explicitamente que os concorrentes estão operando os pacientes que deveriam ser dele.`;

  const promptPhase3 = `Dados da Região de ${metrics.city} para procedimentos de ${metrics.highTicketProcedure}:
1. Perfil do Dr. ${metrics.doctorName}:
   - Nota: ${metrics.googleRating}
   - Reviews: ${metrics.googleReviews}
   - Queixas: ${metrics.googleComplaints}

2. Principal Concorrente (O Líder):
   - ${metrics.competitorsData}

3. Tendências de Busca (Google Trends):
   - Termo em alta: ${metrics.trendKeyword} (Crescimento de ${metrics.trendGrowth}%).

Crie o "Relatório de Competitividade". Ferir o ego profissional dele de forma construtiva é necessário para a "cura" (mudança).
Retorne APENAS um objeto JSON com as chaves 'text' e 'severity' ("low"|"medium"|"high").`;


  try {
    // Run Phases 1, 2, 3 in parallel
    const [res1, res2, res3] = await Promise.all([
      runPhase(sysPhase1, promptPhase1, true),
      runPhase(sysPhase2, promptPhase2, true),
      runPhase(sysPhase3, promptPhase3, true)
    ]);

    const technicalData = JSON.parse(res1);
    const brandingData = JSON.parse(res2);
    const marketData = JSON.parse(res3);


    // --- FASE 4: Diagnóstico Clínico (Sales Pitch) ---
    const sysPhase4 = `Você é o Diretor Clínico do OrtoAudit. Você vai consolidar as análises em um "Prontuário Digital".
    O tom deve ser: "O quadro é grave (risco de óbito digital), mas eu tenho o protocolo de salvamento".
    Foque estritamente em atrair procedimentos de Alto Valor (Cirurgias).`;

    const promptPhase4 = `Com base na anamnese anterior:
    
    [TRIAGEM]: ${technicalData.text}
    [IMAGEM]: ${brandingData.text}
    [MERCADO]: ${marketData.text}

    Gere o Plano de Tratamento para atrair pacientes de ${metrics.highTicketProcedure}.

    Estrutura Obrigatória (JSON):
    {
      "headline": "Título impactante sobre a 'Patologia Principal' encontrada",
      "symptoms": ["Sintoma 1 (Ex: Perda de pacientes para Dr. Concorrente)", "Sintoma 2 (Ex: Invisibilidade em mobile)", "Sintoma 3"],
      "prognosis": "O que acontecerá se não tratar (Ex: Falência de autoridade em 12 meses)",
      "treatmentPlan": ["Intervenção 1 (Ação Imediata)", "Intervenção 2 (Procedimento)", "Intervenção 3 (Alta)"]
    }`;

    // --- FASE 5: Prescrição (Google Ads CSV) ---
    const sysPhase5 = `Você é um Especialista em Google Ads focado em Cirurgia Ortopédica.
    Sua saída deve ser EXCLUSIVAMENTE técnica (CSV).
    Foque em termos de fundo de funil (Dor, Cirurgia, Especialista).`;

    const promptPhase5 = `Médico: ${metrics.doctorName}. Especialidade: ${metrics.highTicketProcedure}. Cidade: ${metrics.city}.
    
    Crie a "Prescrição Digital" (Campanha Ads).
    TAREFA 1: 5 Títulos de Anúncio focados em dor e solução cirúrgica.
    TAREFA 2: 3 Descrições de alta autoridade.
    TAREFA 3: 15 Palavras-chave exatas (ex: "cirurgia de quadril valor", "melhor ortopedista joelho").

    SAÍDA: Apenas CSV padrão Google Ads Editor (Campaign, Ad Group, Keyword, Headline 1, Headline 2, Description, Path 1). Sem markdown.`;

    // Run Phases 4 and 5 in parallel
    const [res4, res5] = await Promise.all([
        runPhase(sysPhase4, promptPhase4, true),
        runPhase(sysPhase5, promptPhase5, false)
    ]);

    const salesPitchData = JSON.parse(res4);
    const csvData = res5.trim();

    return {
      technical: {
        text: technicalData.text,
        severity: technicalData.severity || 'medium'
      },
      branding: {
        text: brandingData.text,
        severity: brandingData.severity || 'medium'
      },
      market: {
        text: marketData.text,
        severity: marketData.severity || 'medium'
      },
      salesPitch: {
        headline: salesPitchData.headline || "Diagnóstico indisponível",
        symptoms: salesPitchData.symptoms || [],
        prognosis: salesPitchData.prognosis || "",
        treatmentPlan: salesPitchData.treatmentPlan || []
      },
      googleAdsCsv: csvData
    };

  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
};