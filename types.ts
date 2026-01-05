export interface AuditRequest {
  doctorName: string;
  specialty: string;
  city: string;
  websiteUrl: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
