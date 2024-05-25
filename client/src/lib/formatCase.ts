export function formatCase(stringToFormat: string): string {
  return stringToFormat[0]?.toUpperCase() + stringToFormat.substring(1, stringToFormat.length);
}
