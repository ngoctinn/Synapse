export function getNestedValue(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any,
  path: string | number | symbol | undefined
) {
  if (!path || typeof path !== "string") return path ? obj[path] : undefined;

  return path.split(".").reduce((acc, part) => {
    return acc && acc[part] !== undefined ? acc[part] : undefined;
  }, obj);
}
