export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Asset {
  id: string;
  hostname: string;
  type: string;
  ip: string;
  status: "healthy" | "suspicious" | "compromised" | "isolated";
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  severity: Severity;
  assetId: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: "ACTIVE" | "INVESTIGATING" | "CONTAINED";
  startedAt: string;
  alerts: number;
  eventsCount: number;
  assets: Asset[];
  timeline: SecurityEvent[];
}