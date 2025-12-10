export function getNestedValue(obj: any, path: string | number | symbol | undefined) {
  if (!path || typeof path !== 'string') return path ? obj[path] : undefined;

  return path.split('.').reduce((acc, part) => {
    return acc && acc[part] !== undefined ? acc[part] : undefined;
  }, obj);
}
