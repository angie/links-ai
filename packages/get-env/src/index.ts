export function getEnvVar<T>(key: string, defaultValue?: T): T | string {
  const value = process.env[key];

  if (value !== undefined) {
    return value as unknown as T;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  return "";
}
