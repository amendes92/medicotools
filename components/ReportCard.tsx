import React from 'react';
import { AnalysisResult, ReportSection, SalesPitch } from '../types';

interface ReportCardProps {
  result: AnalysisResult;
  doctorName: string;
}

const SeverityBadge = ({ severity, type }: { severity: string, type: string }) => {
  const styles = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-200',
    low: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };
  
  const labels = {
    high: 'CRÍTICO',
    medium: 'ATENÇÃO',
    low: 'SAUDÁVEL',
  };

  const s = severity as 'high' | 'medium' | 'low';

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${styles[s]}`}>
      {type}: {labels[s]}
    </span>
  );
};

const Section = ({ title, data, icon }: { title: string, data: ReportSection, icon: React.ReactNode }) => {
  const borderColors = {
    high: 'border-l-red-500',
    medium: 'border-l-amber-500',
    low: 'border-l-emerald-500',
  };
  
  const s = data.severity as 'high' | 'medium' | 'low';

  return (
    <div className={`pl-4 border-l-4 ${borderColors[s]} mb-6 last:mb-0`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          {icon}
          {title}
        </h4>
        <SeverityBadge severity={data.severity} type="GRAVIDADE" />
      </div>
      <div className="prose prose-slate max-w-none bg-white/50 p-3 rounded-lg">
        <p className="text-slate-700 leading-relaxed whitespace-pre-line font-medium text-sm sm:text-base">
          {data.text}
        </p>
      </div>
    </div>
  );
};

const SalesPitchSection = ({ data }: { data: SalesPitch }) => {
  return (
    <div className="mt-8 bg-slate-900 rounded-xl p-6 text-white shadow-xl border border-slate-700 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-blue-500 blur-3xl opacity-20"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4 text-blue-400 font-mono text-xs uppercase tracking-widest">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Prontuário Digital: Plano de Tratamento
        </div>

        <h2 className="text-2xl font-bold text-white mb-6 leading-tight">
          {data.headline}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h5 className="text-red-400 font-bold text-sm mb-3 uppercase flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Sintomas Clínicos
            </h5>
            <ul className="space-y-3">
              {data.symptoms.map((symptom, idx) => (
                <li key={idx} className="flex items-start text-sm text-slate-300">
                  <span className="mr-2 text-red-500 mt-0.5">•</span>
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h5 className="text-blue-400 font-bold text-sm mb-3 uppercase flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Plano Cirúrgico
            </h5>
            <ul className="space-y-3">
              {data.treatmentPlan.map((plan, idx) => (
                <li key={idx} className="flex items-start text-sm text-slate-300">
                  <span className="mr-2 text-blue-500 mt-0.5">✓</span>
                  <span>{plan}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-lg mb-6">
          <h5 className="text-amber-500 font-bold text-sm mb-1 uppercase">Prognóstico sem Tratamento</h5>
          <p className="text-amber-100 text-sm italic opacity-90">
            "{data.prognosis}"
          </p>
        </div>

        <div className="text-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 uppercase tracking-wide text-sm">
                Iniciar Tratamento Digital
            </button>
        </div>
      </div>
    </div>
  );
};

const CsvSection = ({ csvData, doctorName }: { csvData: string; doctorName: string }) => {
  const handleDownload = () => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `google_ads_prescricao_${doctorName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(csvData);
  };

  return (
    <div className="mt-8 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          Prescrição: Campanha Google Ads
        </h3>
        <div className="flex gap-2">
            <button 
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              Copiar
            </button>
            <button 
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Baixar .CSV
            </button>
        </div>
      </div>
      <p className="text-sm text-slate-600 mb-3">
        Arquivo de importação direta para o Google Ads Editor. Contém estrutura de campanha, anúncios e palavras-chave otimizadas.
      </p>
      <div className="relative">
        <textarea 
          readOnly 
          value={csvData}
          className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-md font-mono text-xs text-slate-600 focus:outline-none resize-none"
        />
      </div>
    </div>
  );
};

export const ReportCard: React.FC<ReportCardProps> = ({ result, doctorName }) => {
  // Determine overall card style based on the worst severity of any section
  const severities = [result.technical.severity, result.branding.severity, result.market.severity];
  const isCritical = severities.includes('high');
  const isWarning = !isCritical && severities.includes('medium');
  
  let containerStyle = 'bg-emerald-50 border-emerald-200';
  if (isCritical) containerStyle = 'bg-red-50 border-red-200';
  else if (isWarning) containerStyle = 'bg-amber-50 border-amber-200';

  return (
    <div className={`rounded-xl border shadow-sm transition-all duration-500 ease-in-out overflow-hidden mt-6 ${containerStyle}`}>
      <div className="p-6">
        <div className="flex items-center justify-between border-b border-current/10 pb-4 mb-6">
          <h3 className="text-xl font-bold text-slate-900">
            Diagnóstico 360º: Dr. {doctorName}
          </h3>
          <span className="text-xs font-mono opacity-70">
            {new Date().toLocaleDateString('pt-BR')}
          </span>
        </div>

        <Section 
          title="Infraestrutura (Ortopedia Técnica)"
          data={result.technical}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 opacity-75">
              <path fillRule="evenodd" d="M11.42 2.766a1.5 1.5 0 012.16 0l5.654 5.654a1.5 1.5 0 01-2.122 2.122l-1.364-1.364v12.072a.75.75 0 01-1.5 0V9.178l-1.364 1.364a1.5 1.5 0 01-2.122-2.122l5.655-5.654zM4.775 8.42a1.5 1.5 0 00-2.12 2.12l5.654 5.655a1.5 1.5 0 002.12-2.12L4.775 8.42zm16.585 2.121a1.5 1.5 0 00-2.121-2.121l-5.655 5.654a1.5 1.5 0 002.122 2.121l5.654-5.654z" clipRule="evenodd" />
            </svg>
          }
        />

        <div className="border-t border-current/10 my-4"></div>

        <Section 
          title="Autoridade & Branding"
          data={result.branding}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 opacity-75">
              <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
              <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
          }
        />

        <div className="border-t border-current/10 my-4"></div>

        <Section 
          title="Competitividade & Mercado"
          data={result.market}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 opacity-75">
              <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0zm1.5 0v.002c0 .019 0 .037.001.056a6.75 6.75 0 006.749 6.692v-6.75H3.75z" clipRule="evenodd" />
              <path d="M22.5 13.5a8.25 8.25 0 00-8.25-8.25.75.75 0 00-.75.75v6.75H6.75a.75.75 0 00-.75.75 8.25 8.25 0 0016.5 0z" />
            </svg>
          }
        />

        <SalesPitchSection data={result.salesPitch} />
        
        {result.googleAdsCsv && (
          <CsvSection csvData={result.googleAdsCsv} doctorName={doctorName} />
        )}
      </div>
    </div>
  );
};