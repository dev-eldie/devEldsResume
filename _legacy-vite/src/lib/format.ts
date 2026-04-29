const nf = (digits = 0) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });

export const formatNumber = (n: number, digits = 0) => nf(digits).format(n);
export const formatKwh = (n: number) => `${formatNumber(n, 1)} kWh/h`;
export const formatLiters = (n: number) => `${formatNumber(n, 0)} L/h`;
export const formatKgCo2 = (n: number) => `${formatNumber(n, 1)} kg CO₂e/h`;
export const formatKg = (n: number) => `${formatNumber(n, 1)} kg/h`;
export const formatTemp = (n: number) => `${formatNumber(n, 0)} °C`;
export const formatPct = (n: number) => `${formatNumber(n, 1)}%`;
