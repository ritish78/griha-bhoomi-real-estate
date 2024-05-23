export function formatPrice(amount: number, locale: string = "en-US"): string {
  return amount.toLocaleString(locale);
}
