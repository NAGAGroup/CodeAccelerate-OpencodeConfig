import type { PhaseType } from "../../types";

export const VALID_PHASE_TYPES = new Set<string>([
  "web-search",
  "deep-project-search-and-analysis",
  "project-survey",
  "work",
  "project-setup",
  "user-discussion",
  "user-decision-gate",
  "agentic-decision-gate",
  "write-notes",
  "early-exit",
]);

export const BRANCHING_PHASE_TYPE_SET = new Set<string>([
  "agentic-decision-gate",
  "user-decision-gate",
]);

/** Validate phase_options for a given phase type. Throws with a clear message on failure. */
export function validatePhaseOptions(
  phase_type: string,
  opts: Record<string, unknown>,
): void {
  const require = (field: string, expectedType?: string) => {
    if (!(field in opts) || opts[field] === null || opts[field] === undefined) {
      throw new Error(
        `Phase type '${phase_type}' requires '${field}' in phase_options.`,
      );
    }
    if (expectedType === "string" && typeof opts[field] !== "string") {
      throw new Error(`'${field}' must be a string.`);
    }
    if (expectedType === "string[]" && !Array.isArray(opts[field])) {
      throw new Error(`'${field}' must be an array of strings.`);
    }
  };

  switch (phase_type) {
    case "web-search":
      require("questions", "string[]");
      if (
        opts["research-type"] &&
        !["standard", "deep"].includes(opts["research-type"] as string)
      ) {
        throw new Error(
          `Invalid value for 'research-type': '${opts["research-type"]}'. Expected: standard | deep.`,
        );
      }
      break;
    case "deep-project-search-and-analysis":
      require("questions", "string[]");
      break;
    case "project-survey":
      require("topics", "string[]");
      break;
    case "work":
      require("goal", "string");
      require("work-type", "string");
      require("verify-description", "string");
      require("project-survey-topics", "string[]");
      require("deep-search-questions", "string[]");
      if (!["code", "docs"].includes(opts["work-type"] as string)) {
        throw new Error(
          `Invalid value for 'work-type': '${opts["work-type"]}'. Expected: code | docs.`,
        );
      }
      break;
    case "project-setup":
      require("goals", "string[]");
      break;
    case "user-discussion":
      require("topic", "string");
      break;
    case "user-decision-gate":
      require("question", "string");
      break;
    case "agentic-decision-gate":
      require("question", "string");
      break;
    case "write-notes":
    case "early-exit":
      // All fields optional
      break;
  }
}
