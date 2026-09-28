export function formatPrice(amount: number, locale: string = "en-IN"): string {
  //We display large prices using lakh and crore.
  //The original numeric value remains unchanged for filtering and sorting.
  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2
  });

  if (amount >= 10000000) {
    return `${formatter.format(amount / 10000000)} Crore`;
  }

  if (amount >= 100000) {
    return `${formatter.format(amount / 100000)} Lakh`;
  }

  //Smaller prices, such as monthly rent, are displayed as the full amount.
  return formatter.format(amount);
}
