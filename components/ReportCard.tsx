import React from 'react';

interface ReportCardProps {
  markdown: string;
  doctorName: string;
}

export const ReportCard: React.FC<ReportCardProps> = ({ markdown, doctorName }) => {
  // Simple markdown-to-jsx parser to structure the report nicely
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // H1
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold text-slate-900 mt-8 mb-4 border-b pb-2">{line.replace('# ', '')}</h1>;
      }
      // H2
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-bold text-blue-800 mt-6 mb-3 flex items-center"><span className="w-1.5 h-6 bg-blue-600 mr-2 rounded-full"></span>{line.replace('## ', '')}</h2>;
      }
      // Bold list items or normal text
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return <li key={index} className="ml-4 list-disc text-slate-700 mb-1">{line.replace(/^[-*] /, '')}</li>;
      }
      // Empty lines
      if (line.trim() === '') {
        return <br key={index} />;
      }
      // Fallback paragraph
      return <p key={index} className="text-slate-700 leading-relaxed mb-2">{line}</p>;
    });
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Report Header */}
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white">Relatório de Diagnóstico Digital</h2>
          <p className="text-blue-400 text-xs font-mono">Gerado por OrtoAudit AI • {new Date().toLocaleDateString()}</p>
        </div>
        <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium text-white">
            CONFIDENCIAL
        </div>
      </div>

      <div className="p-8">
        <div className="prose prose-slate max-w-none">
           {renderMarkdown(markdown)}
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center">
            <p className="text-slate-500 text-sm mb-4 italic">"O sucesso da cirurgia depende do diagnóstico correto."</p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 uppercase tracking-wide text-sm flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Agendar Consultoria de Implementação
            </button>
        </div>
      </div>
    </div>
  );
};
