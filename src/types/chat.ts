export const insuranceOptions = [
  "Automóvel",
  "Vida",
  "Acidentes pessoais",
  "Acidentes de trabalho",
  "Multirriscos",
  "Outros",
] as const;

export type InsuranceType = (typeof insuranceOptions)[number];

export type ChatStep =
  | "insurance"
  | "registration"
  | "contact"
  | "sending"
  | "finished"
  | "name";

export type MessageSender = "bot" | "user";

export interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
}

export interface LeadData {
  insuranceType: InsuranceType | "";
  registration: string;
  name: string;
  contact: string;
  website?: string;
}

export interface LeadRequest {
  insuranceType: InsuranceType;
  registration?: string;
  contact: string;
  name: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}