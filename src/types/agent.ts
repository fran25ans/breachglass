export interface ToolActivityEvent {
  tool: string;
  summary: string;
}

export interface AgentActivityEntry extends ToolActivityEvent {
  id: string;
  time: string;
}