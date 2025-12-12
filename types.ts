export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface MoodEntry {
  date: string;
  value: number; // 1-5
  note?: string;
}

export interface SafetyPlan {
  warningSigns: string[];
  copingStrategies: string[];
  supporters: { name: string; phone: string }[];
  professionals: { name: string; phone: string }[];
  reasonsToLive: string[];
}

export enum View {
  HOME = 'HOME',
  CHAT = 'CHAT',
  SAFETY_PLAN = 'SAFETY_PLAN',
  GROUNDING = 'GROUNDING',
  MOOD = 'MOOD',
  ANALYSIS = 'ANALYSIS',
}

export interface GroundingStep {
  id: number;
  instruction: string;
  placeholder: string;
  color: string;
}