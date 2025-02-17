// ✅ Format numbers as German currency (€)
export function formatCurrency(value) {
  if (value === null || value === undefined) return "-";
  
  const number = parseFloat(value);
  if (isNaN(number)) return value; // Return original if not a valid number

  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(number);
}
