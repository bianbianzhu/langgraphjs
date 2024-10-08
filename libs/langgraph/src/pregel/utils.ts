import type { ChannelVersions } from "@langchain/langgraph-checkpoint";

export function getNullChannelVersion(currentVersions: ChannelVersions) {
  const versionValues = Object.values(currentVersions);
  const versionType =
    versionValues.length > 0 ? typeof versionValues[0] : undefined;
  let nullVersion: number | string | undefined;
  if (versionType === "number") {
    nullVersion = 0;
  } else if (versionType === "string") {
    nullVersion = "";
  }
  return nullVersion;
}

export function getNewChannelVersions(
  previousVersions: ChannelVersions,
  currentVersions: ChannelVersions
): ChannelVersions {
  // Get new channel versions
  if (Object.keys(previousVersions).length > 0) {
    const nullVersion = getNullChannelVersion(currentVersions);
    return Object.fromEntries(
      Object.entries(currentVersions).filter(
        ([k, v]) => v > (previousVersions[k] ?? nullVersion)
      )
    );
  } else {
    return currentVersions;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function _coerceToDict(value: any, defaultKey: string) {
  return value &&
    !Array.isArray(value) &&
    // eslint-disable-next-line no-instanceof/no-instanceof
    !(value instanceof Date) &&
    typeof value === "object"
    ? value
    : { [defaultKey]: value };
}

// Order matters
export function _getIdMetadata(metadata: Record<string, unknown>) {
  return {
    langgraph_step: metadata.langgraph_step,
    langgraph_node: metadata.langgraph_node,
    langgraph_triggers: metadata.langgraph_triggers,
    langgraph_task_idx: metadata.langgraph_task_idx,
  };
}

export type RetryPolicy = {
  /**
   * Amount of time that must elapse before the first retry occurs in milliseconds.
   * @default 500
   */
  initialInterval?: number;
  /**
   * Multiplier by which the interval increases after each retry.
   * @default 2
   */
  backoffFactor?: number;
  /**
   * Maximum amount of time that may elapse between retries in milliseconds.
   * @default 128000
   */
  maxInterval?: number;
  /**
   * Maximum amount of time that may elapse between retries.
   * @default 3
   */
  maxAttempts?: number;
  /** Whether to add random jitter to the interval between retries. */
  jitter?: boolean;
  /** A function that returns True for exceptions that should trigger a retry. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  retryOn?: (e: any) => boolean;
};
