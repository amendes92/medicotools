import React, { useState } from 'react';
import { MetricInput } from './components/MetricInput';
import { ReportCard } from './components/ReportCard';
import { ApiTestPage } from './components/ApiTestPage';
import { generateMedicalReport } from './services/geminiService';
import { AuditMetrics, AnalysisResult, LoadingState } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'audit' | 'status'>('audit');

  const [metrics, setMetrics] = useState<AuditMetrics>({
    doctorName: 'Dr. Alexandre Mendes',
    // Technical Defaults
    pageSpeedScore: 45,
    lcpTime: 6.2,
    webRiskStatus: 'SAFE', // Mapped from "Site não seguro (HTTP)" conceptually, though strict type is SAFE/UNSAFE
    coreWebVitals: 'FAIL',
    // Branding Defaults
    visionLabels: 'Business, Blue, Handshake, Building, Generic',
    ocrText: 'Bem-vindo ao site. Agende sua consulta hoje mesmo.',
    sentimentScore: 0.1,
    nlpEntities: 'Clínica, Consulta, Agendamento',
    // Market Defaults
    city: 'São Paulo - SP',
    googleRating: 4.2,
    googleReviews: 14,
    googleComplaints: 'Dificuldade de agendamento e espera longa.',
    competitorsData: 'Instituto do Quadril SP (4.9 estrelas, 350 reviews).',
    trendKeyword: 'Prótese de Quadril Robótica',
    trendGrowth: 120,
    highTicketProcedure: 'Cirurgia de Quadril'
  });

  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof AuditMetrics, value: string | number) => {
    setMetrics(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = async () => {
    if (!metrics.doctorName.trim()) {
      setError("Por favor, insira o nome do médico.");
      return;
    }

    setLoadingState(LoadingState.LOADING);
    setError(null);
    setResult(null);

    try {
      const data = await generateMedicalReport(metrics);
      setResult(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (e) {
      console.error(e);
      setError("Falha ao gerar o diagnóstico. Verifique a conexão com o sistema de IA.");
      setLoadingState(LoadingState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-full shadow-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            OrtoTech Audit <span className="text-blue-600">AI</span>
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Auditoria 360º: Técnica, Branding e Estratégia de Mercado
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm inline-flex">
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'audit' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Auditoria Médica
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'status' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Status de API / Testes
            </button>
          </div>
        </div>

        {activeTab === 'status' ? (
          <div className="animate-fade-in-up">
            <ApiTestPage />
          </div>
        ) : (
          /* Main Audit Tool UI */
          <>
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden animate-fade-in-up">
              
              {/* Main Identifier */}
              <div className="px-6 py-6 bg-slate-50 border-b border-slate-100">
                 <MetricInput
                    label="Nome do Médico (Paciente)"
                    value={metrics.doctorName}
                    onChange={(v) => handleInputChange('doctorName', v)}
                    type="text"
                    description="Identificação para o relatório completo."
                  />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3">
                
                {/* Column 1: Technical */}
                <div className="p-6 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/30">
                   <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Técnico
                   </h3>
                   
                   <MetricInput
                    label="PageSpeed Score"
                    value={metrics.pageSpeedScore}
                    onChange={(v) => handleInputChange('pageSpeedScore', v)}
                    type="number"
                    min={0} max={100}
                  />
                  <MetricInput
                    label="LCP Time (s)"
                    value={metrics.lcpTime}
                    onChange={(v) => handleInputChange('lcpTime', v)}
                    type="number"
                    suffix="s"
                  />
                  <MetricInput
                    label="Web Risk"
                    value={metrics.webRiskStatus}
                    onChange={(v) => handleInputChange('webRiskStatus', v)}
                    type="select"
                    options={['SAFE', 'UNSAFE']}
                  />
                  <MetricInput
                    label="Core Web Vitals"
                    value={metrics.coreWebVitals}
                    onChange={(v) => handleInputChange('coreWebVitals', v)}
                    type="select"
                    options={['PASS', 'FAIL']}
                  />
                </div>

                {/* Column 2: Branding */}
                <div className="p-6 border-b lg:border-b-0 lg:border-r border-slate-100 bg-white">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                    Branding
                   </h3>

                   <MetricInput
                    label="Vision Labels"
                    value={metrics.visionLabels}
                    onChange={(v) => handleInputChange('visionLabels', v)}
                    type="text"
                  />
                  <MetricInput
                    label="OCR Text"
                    value={metrics.ocrText}
                    onChange={(v) => handleInputChange('ocrText', v)}
                    type="textarea"
                    rows={2}
                  />
                  <MetricInput
                    label="Sentimento (Score)"
                    value={metrics.sentimentScore}
                    onChange={(v) => handleInputChange('sentimentScore', v)}
                    type="number"
                    min={-1} max={1}
                  />
                  <MetricInput
                    label="Entidades NLP"
                    value={metrics.nlpEntities}
                    onChange={(v) => handleInputChange('nlpEntities', v)}
                    type="text"
                  />
                </div>

                {/* Column 3: Market */}
                <div className="p-6 bg-slate-50/30">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Mercado & Vendas
                   </h3>

                   <MetricInput
                    label="Cidade de Atuação"
                    value={metrics.city}
                    onChange={(v) => handleInputChange('city', v)}
                    type="text"
                  />
                  
                  <MetricInput
                    label="Procedimento Alto Valor"
                    value={metrics.highTicketProcedure}
                    onChange={(v) => handleInputChange('highTicketProcedure', v)}
                    type="text"
                    description="Ex: Prótese, Artroscopia"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <MetricInput
                      label="Nota Google"
                      value={metrics.googleRating}
                      onChange={(v) => handleInputChange('googleRating', v)}
                      type="number"
                      min={0} max={5}
                    />
                    <MetricInput
                      label="Qtd Reviews"
                      value={metrics.googleReviews}
                      onChange={(v) => handleInputChange('googleReviews', v)}
                      type="number"
                    />
                  </div>
                  <MetricInput
                    label="Top Concorrentes"
                    value={metrics.competitorsData}
                    onChange={(v) => handleInputChange('competitorsData', v)}
                    type="textarea"
                    rows={2}
                  />
                  <div className="grid grid-cols-2 gap-2">
                     <MetricInput
                      label="Trend Keyword"
                      value={metrics.trendKeyword}
                      onChange={(v) => handleInputChange('trendKeyword', v)}
                      type="text"
                    />
                     <MetricInput
                      label="Crescimento %"
                      value={metrics.trendGrowth}
                      onChange={(v) => handleInputChange('trendGrowth', v)}
                      type="number"
                      suffix="%"
                    />
                  </div>
                </div>

              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={handleAnalyze}
                  disabled={loadingState === LoadingState.LOADING}
                  className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full md:w-auto justify-center
                    ${loadingState === LoadingState.LOADING 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {loadingState === LoadingState.LOADING ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Gerar Prontuário Digital
                    </>
                  ) : (
                    'Gerar Auditoria & Venda'
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 rounded-md bg-red-50 border border-red-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Erro no Sistema</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="animate-fade-in-up">
                <ReportCard result={result} doctorName={metrics.doctorName} />
              </div>
            )}
          </>
        )}
        
      </div>
    </div>
  );
};

export default App;