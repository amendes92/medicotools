import React, { useState, useEffect } from 'react';
import { testGeminiConnection } from '../services/geminiService';

interface ApiStatus {
  name: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
  latency?: number;
}

export const ApiTestPage: React.FC = () => {
  const [geminiStatus, setGeminiStatus] = useState<ApiStatus>({ name: 'Google Gemini AI', status: 'idle' });
  const [envStatus, setEnvStatus] = useState<ApiStatus>({ name: 'Variáveis de Ambiente', status: 'idle' });

  useEffect(() => {
    checkEnv();
  }, []);

  const checkEnv = () => {
    setEnvStatus({ name: 'Variáveis de Ambiente', status: 'loading' });
    const apiKey = process.env.API_KEY;
    
    setTimeout(() => {
      if (apiKey && apiKey.length > 10) {
        setEnvStatus({ 
          name: 'Variáveis de Ambiente', 
          status: 'success', 
          message: 'API Key encontrada e formatada corretamente.' 
        });
      } else {
        setEnvStatus({ 
          name: 'Variáveis de Ambiente', 
          status: 'error', 
          message: 'API Key não encontrada ou inválida em process.env.API_KEY' 
        });
      }
    }, 500); // Fake delay for UX
  };

  const testGemini = async () => {
    setGeminiStatus({ name: 'Google Gemini AI', status: 'loading', message: 'Conectando ao modelo gemini-3-flash-preview...' });
    const start = performance.now();
    
    try {
      const response = await testGeminiConnection();
      const end = performance.now();
      setGeminiStatus({ 
        name: 'Google Gemini AI', 
        status: 'success', 
        message: `Resposta da IA: "${response.trim()}"`,
        latency: Math.round(end - start)
      });
    } catch (error: any) {
      setGeminiStatus({ 
        name: 'Google Gemini AI', 
        status: 'error', 
        message: error.message || 'Falha na conexão com a API' 
      });
    }
  };

  const runAllTests = () => {
    checkEnv();
    testGemini();
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'loading':
        return <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
      case 'success':
        return <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
      case 'error':
        return <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
      default:
        return <div className="h-4 w-4 rounded-full bg-slate-300"></div>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Painel de Diagnóstico de API
        </h2>
        <button 
          onClick={runAllTests}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-md"
        >
          Executar Todos os Testes
        </button>
      </div>

      <div className="p-6 space-y-4">
        
        {/* Environment Test */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm">
               <StatusIcon status={envStatus.status} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{envStatus.name}</h3>
              <p className="text-sm text-slate-500">Verifica se a API Key está configurada no ambiente.</p>
            </div>
          </div>
          <div className="text-right">
             <span className={`text-xs font-mono px-2 py-1 rounded ${envStatus.status === 'success' ? 'bg-emerald-100 text-emerald-800' : envStatus.status === 'error' ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-600'}`}>
               {envStatus.status.toUpperCase()}
             </span>
          </div>
        </div>
        {envStatus.message && (
          <div className="ml-16 -mt-2 mb-4 p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-md shadow-inner">
             $ env_check: {envStatus.message}
          </div>
        )}


        {/* Gemini Test */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm">
               <StatusIcon status={geminiStatus.status} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{geminiStatus.name}</h3>
              <p className="text-sm text-slate-500">Teste de conexão real (Prompt simples) no modelo gemini-3-flash-preview.</p>
            </div>
          </div>
           <div className="text-right">
             {geminiStatus.latency && (
                <span className="block text-xs text-slate-400 mb-1">{geminiStatus.latency}ms</span>
             )}
             <button 
               onClick={testGemini}
               disabled={geminiStatus.status === 'loading'}
               className="text-sm text-blue-600 font-medium hover:underline disabled:opacity-50"
             >
               {geminiStatus.status === 'loading' ? 'Testando...' : 'Retestar'}
             </button>
          </div>
        </div>
        {geminiStatus.message && (
          <div className={`ml-16 -mt-2 mb-4 p-3 font-mono text-xs rounded-md shadow-inner ${geminiStatus.status === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-slate-900 text-green-400'}`}>
             {geminiStatus.status === 'success' && <span className="text-slate-500 select-none mr-2">{">"}</span>}
             {geminiStatus.message}
          </div>
        )}

      </div>
      
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
         <span>SDK: @google/genai</span>
         <span>Model: gemini-3-flash-preview</span>
      </div>
    </div>
  );
};