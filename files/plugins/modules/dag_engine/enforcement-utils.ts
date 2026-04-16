/** Returns true if the enforcement item is prefixed with "optional:". */
export function isOptional(item: string): boolean {
  return item.startsWith("optional:");
}

/** Strips the "optional:" prefix to get the bare tool name. */
export function getToolName(item: string): string {
  return item.startsWith("optional:") ? item.slice("optional:".length) : item;
}

/** Returns true if all enforcement items from fromIndex onward are optional. */
export function allRemainingOptional(enforcement: string[], fromIndex: number): boolean {
  return enforcement.slice(fromIndex).every(isOptional);
}
