import type { Incident } from "../types/incident";

export const incident042: Incident = {
  id: "INC-042",
  title: "Credential Theft & Lateral Movement",
  severity: "CRITICAL",
  status: "ACTIVE",
  startedAt: "08:32:14",
  alerts: 18,
  eventsCount: 238,

  assets: [
    {
      id: "asset-1",
      hostname: "web-02",
      type: "Production Web Server",
      ip: "10.20.4.22",
      status: "compromised",
    },
    {
      id: "asset-2",
      hostname: "db-01",
      type: "Database Server",
      ip: "10.20.4.35",
      status: "suspicious",
    },
    {
      id: "asset-3",
      hostname: "admin-laptop",
      type: "Administrator Workstation",
      ip: "10.20.8.12",
      status: "suspicious",
    },
    {
      id: "asset-4",
      hostname: "auth-01",
      type: "Authentication Server",
      ip: "10.20.2.10",
      status: "healthy",
    },
  ],

  timeline: [
    {
      id: "evt-001",
      timestamp: "08:32:14",
      title: "Suspicious login",
      description:
        "Successful authentication from an unusual external IP address.",
      severity: "HIGH",
      assetId: "asset-1",
    },
    {
      id: "evt-002",
      timestamp: "08:34:27",
      title: "PowerShell execution",
      description:
        "Encoded PowerShell command executed by the compromised account.",
      severity: "CRITICAL",
      assetId: "asset-1",
    },
    {
      id: "evt-003",
      timestamp: "08:36:03",
      title: "Credential access detected",
      description:
        "Process attempted to access authentication material.",
      severity: "CRITICAL",
      assetId: "asset-1",
    },
    {
      id: "evt-004",
      timestamp: "08:38:41",
      title: "Lateral movement",
      description:
        "Compromised account authenticated against database server db-01.",
      severity: "CRITICAL",
      assetId: "asset-2",
    },
    {
      id: "evt-005",
      timestamp: "08:41:19",
      title: "Administrative session",
      description:
        "Unexpected privileged connection established with admin-laptop.",
      severity: "HIGH",
      assetId: "asset-3",
    },
  ],
};