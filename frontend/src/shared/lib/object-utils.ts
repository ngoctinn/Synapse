export function getNestedValue(
  obj: Record<string, any> | null | undefined,
  path: string | number | symbol | undefined
) {
  if (!obj) return undefined;
  if (!path || typeof path !== "string") return path ? obj[path as string] : undefined;

  return path.split(".").reduce((acc, part) => {
    return acc && acc[part] !== undefined ? acc[part] : undefined;
  }, obj as any);
}