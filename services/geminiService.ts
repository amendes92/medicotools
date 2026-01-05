import { GoogleGenAI } from "@google/genai";
import { AuditMetrics, AnalysisResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = "gemini-3-flash-preview";

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
  const sysPhase1 = `Você é um Especialista em Auditoria Técnica para Médicos. Sua função é traduzir métricas de engenharia de software para a linguagem de um Cirurgião Ortopedista. Nunca use jargão técnico sem explicá-lo com uma metáfora do corpo humano.
Metáforas Obrigatórias:
Site Lento = "Mobilidade Reduzida" ou "Articulação Travada".
Erro de Segurança = "Baixa Imunidade" ou "Risco de Infecção Viral".
UX Ruim no Celular = "Ambiente sem Acessibilidade".`;

  const promptPhase1 = `Aqui estão os dados brutos da infraestrutura do site do Dr. ${metrics.doctorName}:
1. PageSpeed Mobile Score: ${metrics.pageSpeedScore}
2. Tempo de Carregamento (LCP): ${metrics.lcpTime}s
3. Web Risk API Status: ${metrics.webRiskStatus}
4. Core Web Vitals: ${metrics.coreWebVitals}

Gere um parágrafo de "Triagem Inicial". Se a nota for baixa, seja alarmista mas profissional, como um médico alertando sobre um exame de sangue ruim.
Além do texto, classifique a severidade em JSON no final no formato: { "text": "...", "severity": "low|medium|high" } (Mas retorne apenas o JSON para facilitar o parsing nesta implementação).`;

  // Adjusted Phase 1 to return JSON directly for the UI structure
  const promptPhase1Json = promptPhase1 + `\n IMPORTANTE: Retorne APENAS um objeto JSON com as chaves 'text' e 'severity'.`;


  // --- FASE 2: Exame Físico (Branding) ---
  const sysPhase2 = `Você é um Consultor de Branding Médico e Especialista em Semântica. Você analisa imagens e textos para determinar a "Autoridade Percebida". Você deve ser crítico. Médicos odeiam parecer amadores.`;
  
  const promptPhase2 = `Analisei o site do Dr. ${metrics.doctorName} usando a Cloud Vision API e Natural Language API.
1. Rótulos das Imagens (Vision API): ${metrics.visionLabels}
2. OCR (Texto nas imagens): ${metrics.ocrText}
3. Análise de Sentimento do Texto (NLP): ${metrics.sentimentScore}
4. Palavras-chave mais usadas: ${metrics.nlpEntities}

Diagnostique a "Imagem do Paciente":
- As fotos são autênticas ou banco de imagem genérico? (Se tiver 'Generic', critique severamente).
- O texto transmite empatia e técnica ou é frio?
- O site menciona tecnologias modernas (Robótica, Minimamente Invasiva) ou parece desatualizado?

Retorne APENAS um objeto JSON com as chaves 'text' e 'severity' ("low"|"medium"|"high").`;


  // --- FASE 3: Raio-X do Mercado (Market) ---
  const sysPhase3 = `Você é um Estrategista de Mercado para Clínicas. Seu objetivo é mostrar ao médico que ele está perdendo território para concorrentes inferiores. Use dados para ferir o ego profissional dele de forma construtiva, motivando a mudança.`;

  const promptPhase3 = `Dados da Região de ${metrics.city} para Ortopedia:
1. Perfil do Dr. ${metrics.doctorName} no Google Maps:
   - Nota: ${metrics.googleRating}
   - Reviews: ${metrics.googleReviews}
   - Principais Reclamações: ${metrics.googleComplaints}

2. Top Concorrentes:
   - ${metrics.competitorsData}

3. Tendências de Busca (Google Trends):
   - Termo em alta: ${metrics.trendKeyword} (Crescimento de ${metrics.trendGrowth}%).

Crie o "Relatório de Competitividade". Mostre explicitamente onde os concorrentes estão ganhando.
Retorne APENAS um objeto JSON com as chaves 'text' e 'severity' ("low"|"medium"|"high").`;


  try {
    // Run Phases 1, 2, 3 in parallel
    const [res1, res2, res3] = await Promise.all([
      runPhase(sysPhase1, promptPhase1Json, true),
      runPhase(sysPhase2, promptPhase2, true),
      runPhase(sysPhase3, promptPhase3, true)
    ]);

    const technicalData = JSON.parse(res1);
    const brandingData = JSON.parse(res2);
    const marketData = JSON.parse(res3);


    // --- FASE 4: Diagnóstico Clínico (Sales Pitch) ---
    const sysPhase4 = `Você é o Diretor Comercial de uma Agência de Marketing Médico de Elite. Você vai consolidar as análises anteriores em um "Prontuário Digital". O tom deve ser: "A situação é grave, mas eu tenho a cura".`;

    const promptPhase4 = `Com base nas análises anteriores:
    
    [TRIAGEM TÉCNICA]: ${technicalData.text}
    [EXAME BRANDING]: ${brandingData.text}
    [RAIO-X MERCADO]: ${marketData.text}

    Escreva o texto para a Landing Page personalizada deste cliente.
    Foque em procedimentos de alto ticket: ${metrics.highTicketProcedure}.

    Estrutura Obrigatória (Retorne EXCLUSIVAMENTE como JSON):
    {
      "headline": "Um título impactante sobre o maior problema encontrado (A Queixa Principal)",
      "symptoms": ["Sintoma 1 (dados técnicos + perda pacientes)", "Sintoma 2", "Sintoma 3"],
      "prognosis": "O que vai acontecer se ele não fizer nada (Prognóstico sem Tratamento)",
      "treatmentPlan": ["Ação 1 (Plano Cirúrgico)", "Ação 2", "Ação 3"]
    }`;

    // --- FASE 5: Prescrição (Google Ads CSV) ---
    const sysPhase5 = `Você é um Especialista em Google Ads Certificado. Sua saída deve ser EXCLUSIVAMENTE técnica e formatada (CSV).`;

    const promptPhase5 = `O médico é ortopedista especialista em ${metrics.highTicketProcedure} na cidade de ${metrics.city}.
    
    Baseado nas dores identificadas:
    - Problemas técnicos: ${technicalData.text}
    - Mercado: ${marketData.text}

    Crie uma estrutura de campanha de Alta Conversão.
    TAREFA 1: Escreva 5 Títulos de Anúncio (Max 30 chars).
    TAREFA 2: Escreva 3 Descrições (Max 90 chars).
    TAREFA 3: Liste 15 Palavras-chave exatas.

    SAÍDA ESPERADA:
    Gere apenas os dados brutos no formato CSV padrão do Google Ads Editor, colunas: Campaign, Ad Group, Keyword, Headline 1, Headline 2, Description, Path 1.
    Não use formatação Markdown (sem \`\`\`csv). Apenas o texto puro do CSV.`;

    // Run Phases 4 and 5 in parallel
    const [res4, res5] = await Promise.all([
        runPhase(sysPhase4, promptPhase4, true),
        runPhase(sysPhase5, promptPhase5, false)
    ]);

    const salesPitchData = JSON.parse(res4);
    const csvData = res5.trim(); // Ensure no extra whitespace

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