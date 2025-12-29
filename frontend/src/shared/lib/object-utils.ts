export function getNestedValue(
  obj: Record<string, unknown> | null | undefined,
  path: string | number | symbol | undefined
) {
  if (!obj) return undefined;
  if (!path || typeof path !== "string")
    return path ? (obj[path as string] as unknown) : undefined;

  return path.split(".").reduce((acc, part) => {
    return acc && (acc as Record<string, unknown>)[part] !== undefined
      ? (acc as Record<string, unknown>)[part]
      : undefined;
  }, obj as unknown);
}
