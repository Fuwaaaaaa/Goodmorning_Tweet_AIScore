
export interface CategoryEvaluation {
  score: number;
  advice: string;
}

export interface AnalysisResult {
  score: number;
  title: string;
  summary: string;
  composition: CategoryEvaluation;
  lighting: CategoryEvaluation;
  color: CategoryEvaluation;
  pose: CategoryEvaluation;
  costume: CategoryEvaluation;
  strengths: string[];
  improvements: string[];
  technical_advice: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export enum EvaluationMode {
  SWEET = 'SWEET',
  MEDIUM = 'MEDIUM',
  SPICY = 'SPICY',
}
