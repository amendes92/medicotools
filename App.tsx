import React, { useState } from 'react';
import { MetricInput } from './components/MetricInput';
import { ReportCard } from './components/ReportCard';
import { ApiTestPage } from './components/ApiTestPage';
import { runOrthoAudit } from './services/geminiService';
import { AuditRequest, LoadingState } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'audit' | 'status'>('audit');

  const [request, setRequest] = useState<AuditRequest>({
    doctorName: 'Dr. Alexandre Mendes',
    specialty: 'Cirurgião de Quadril',
    city: 'São Paulo - SP',
    websiteUrl: 'https://www.dralexandremendes.com.br'
  });

  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [reportMarkdown, setReportMarkdown] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof AuditRequest, value: string | number) => {
    setRequest(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = async () => {
    if (!request.doctorName || !request.websiteUrl) {
      setError("Preencha os campos obrigatórios.");
      return;
    }

    setLoadingState(LoadingState.LOADING);
    setError(null);
    setReportMarkdown(null);

    try {
      const markdown = await runOrthoAudit(request);
      setReportMarkdown(markdown);
      setLoadingState(LoadingState.SUCCESS);
    } catch (e) {
      console.error(e);
      setError("Falha ao gerar a auditoria.");
      setLoadingState(LoadingState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-full shadow-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            OrtoTech Audit <span className="text-blue-600">Automated</span>
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Auditoria Automática com Arsenal Google Integrado
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
              Nova Auditoria
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'status' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Status Sistema
            </button>
          </div>
        </div>

        {activeTab === 'status' ? (
          <div className="animate-fade-in-up">
            <ApiTestPage />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden animate-fade-in-up">
              
              <div className="px-8 py-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                  <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                  Dados do "Paciente" (Médico)
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <MetricInput
                      label="Nome do Médico"
                      value={request.doctorName}
                      onChange={(v) => handleInputChange('doctorName', v)}
                      type="text"
                    />
                    <MetricInput
                      label="Especialidade"
                      value={request.specialty}
                      onChange={(v) => handleInputChange('specialty', v)}
                      type="text"
                    />
                    <MetricInput
                      label="Cidade de Atuação"
                      value={request.city}
                      onChange={(v) => handleInputChange('city', v)}
                      type="text"
                    />
                    <MetricInput
                      label="URL do Site"
                      value={request.websiteUrl}
                      onChange={(v) => handleInputChange('websiteUrl', v)}
                      type="text"
                      description="Ex: https://www.clinica.com.br"
                    />
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                   <button
                    onClick={handleAnalyze}
                    disabled={loadingState === LoadingState.LOADING}
                    className={`inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all w-full md:w-auto justify-center
                      ${loadingState === LoadingState.LOADING 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5'}`}
                  >
                    {loadingState === LoadingState.LOADING ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Coletando Dados & Analisando...
                      </>
                    ) : (
                      <>
                        Executar Diagnóstico Completo
                        <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 rounded-md bg-red-50 border border-red-200 animate-fade-in-up">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Erro na Auditoria</h3>
                    <div className="mt-2 text-sm text-red-700"><p>{error}</p></div>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {reportMarkdown && (
              <div className="animate-fade-in-up">
                <ReportCard markdown={reportMarkdown} doctorName={request.doctorName} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
