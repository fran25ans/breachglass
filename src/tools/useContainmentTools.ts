import { useWebMCP } from "use-webmcp-tool";

import type { ToolActivityEvent } from "../types/agent";
import type { ContainmentProposal } from "../types/containment";
function getString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}
interface UseContainmentToolsOptions {
  onActivity?: (activity: ToolActivityEvent) => void;

  onProposal?: (
    proposal: ContainmentProposal
  ) => void;

  isApproved?: (
    proposalId: string
  ) => boolean;

  onExecuted?: (
    proposal: ContainmentProposal
  ) => void;
}

const createProposal = (): ContainmentProposal => ({
  id: "CONT-001",

  target: "web-02",

  reason:
    "web-02 is the confirmed initial compromised host and is being used for credential access and lateral movement.",

  impact:
    "Isolating this production server may temporarily interrupt customer access to the affected service.",

  actions: [
    "Isolate web-02 from the network",
    "Revoke active sessions associated with the compromised account",
    "Block attacker IP 185.22.84.17",
  ],

  status: "PENDING",
});

export function useContainmentTools({
  onActivity,
  onProposal,
  isApproved,
  onExecuted,
}: UseContainmentToolsOptions) {
  const logActivity = (
    tool: string,
    summary: string
  ) => {
    onActivity?.({
      tool,
      summary,
    });
  };

  /*
   * TOOL 6
   * Propose containment.
   *
   * Does NOT perform the dangerous action.
   */
  const proposeContainment = useWebMCP({
    name: "propose_containment",

    description:
      "Propose a containment plan for a compromised asset. This tool only proposes actions and must never execute containment. Explicit human approval is required before execute_containment can succeed.",

    inputSchema: {
      type: "object",

      properties: {
        hostname: {
          type: "string",
          description:
            "Hostname of the compromised asset for which containment should be proposed.",
        },
      },

      required: ["hostname"],
      additionalProperties: false,
    },

    annotations: {
      readOnlyHint: true,
    },

    async execute(input) {
        const hostname = getString(input.hostname);

if (!hostname) {
  return {
    proposed: false,
    message: "A valid hostname is required.",
  };
}
  if (hostname.toLowerCase() !== "web-02") {
        logActivity(
          "propose_containment",
`No containment proposal created for ${hostname}. Compromise is not confirmed.`        );

        return {
          proposed: false,

          message:
            "Containment should only be proposed for assets with confirmed compromise.",
        };
      }

      const proposal = createProposal();

      onProposal?.(proposal);

      logActivity(
        "propose_containment",
        "Containment proposed for web-02. Waiting for explicit human approval."
      );

      return {
        proposed: true,

        approvalRequired: true,

        proposal,
      };
    },
  });

  /*
   * TOOL 7
   * Execute containment.
   *
   * This modifies incident state and is blocked
   * unless the human explicitly approved it.
   */
  const executeContainment = useWebMCP({
    name: "execute_containment",

    description:
      "Execute an approved containment proposal. This tool modifies incident state and MUST only execute after explicit human approval in BreachGlass.",

    inputSchema: {
      type: "object",

      properties: {
        proposalId: {
          type: "string",
          description:
            "Identifier of the previously approved containment proposal, for example CONT-001.",
        },
      },

      required: ["proposalId"],
      additionalProperties: false,
    },

    annotations: {
      readOnlyHint: false,
    },

    async execute(input) {
      if (input.proposalId !== "CONT-001") {
        return {
          executed: false,
          status: "INVALID_PROPOSAL",
        };
      }

      const approved =
        isApproved?.(input.proposalId) ??
        false;

      /*
       * Critical security control:
       *
       * The agent CANNOT bypass the human
       * approval step.
       */
      if (!approved) {
        logActivity(
          "execute_containment",
          "BLOCKED — explicit human approval is required before containment can execute."
        );

        return {
          executed: false,

          status:
            "HUMAN_APPROVAL_REQUIRED",

          message:
            "Containment was blocked because the human has not approved proposal CONT-001.",
        };
      }

      const proposal = {
        ...createProposal(),
        status: "EXECUTED" as const,
      };

      onExecuted?.(proposal);

      logActivity(
        "execute_containment",
        "Containment executed: web-02 isolated, sessions revoked and attacker IP blocked."
      );

      return {
        executed: true,

        status: "CONTAINED",

        target: "web-02",

        actionsCompleted: [
          "web-02 isolated",
          "Active compromised sessions revoked",
          "185.22.84.17 blocked",
        ],
      };
    },
  });

  return {
    proposeContainment,
    executeContainment,
  };
}