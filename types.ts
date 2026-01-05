export interface AuditMetrics {
  // Technical
  doctorName: string;
  pageSpeedScore: number;
  lcpTime: number;
  webRiskStatus: 'SAFE' | 'UNSAFE';
  coreWebVitals: 'PASS' | 'FAIL';
  
  // Branding & Semantics
  visionLabels: string; // Comma separated
  ocrText: string;
  sentimentScore: number; // -1.0 to 1.0
  nlpEntities: string; // Comma separated

  // Market & Strategy
  city: string;
  googleRating: number;
  googleReviews: number;
  googleComplaints: string;
  competitorsData: string; // Text describing top competitors
  trendKeyword: string;
  trendGrowth: number;
  highTicketProcedure: string; // New field for targeted procedure
}

export interface ReportSection {
  text: string;
  severity: 'low' | 'medium' | 'high';
}

export interface SalesPitch {
  headline: string;
  symptoms: string[];
  prognosis: string;
  treatmentPlan: string[];
}

export interface AnalysisResult {
  technical: ReportSection;
  branding: ReportSection;
  market: ReportSection;
  salesPitch: SalesPitch;
  googleAdsCsv: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}