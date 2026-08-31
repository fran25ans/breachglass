export type ContainmentStatus =
  | "PENDING"
  | "APPROVED"
  | "DENIED"
  | "EXECUTED";

export interface ContainmentProposal {
  id: string;
  target: string;
  reason: string;
  impact: string;
  actions: string[];
  status: ContainmentStatus;
}