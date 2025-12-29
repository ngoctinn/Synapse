export function getNestedValue(
  obj: Record<string, unknown> | null | undefined,
  path: string | number | symbol | undefined
) {
  if (!obj) return undefined;
  if (!path || typeof path !== "string") return path ? (obj as any)[path] : undefined;

  return path.split(".").reduce((acc, part) => {
    return acc && acc[part] !== undefined ? acc[part] : undefined;
  }, obj);
}
