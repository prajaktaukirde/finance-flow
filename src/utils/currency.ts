export const formatINR = (amount: number, showSign = false): string => {
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(abs);
  if (showSign && amount > 0) return `+${formatted}`;
  if (amount < 0) return `-${formatted}`;
  return formatted;
};

export const formatINRCompact = (amount: number): string => {
  const abs = Math.abs(amount);
  if (abs >= 10000000) return `₹${(abs / 10000000).toFixed(1)}Cr`;
  if (abs >= 100000) return `₹${(abs / 100000).toFixed(1)}L`;
  if (abs >= 1000) return `₹${(abs / 1000).toFixed(1)}K`;
  return `₹${abs.toFixed(0)}`;
};
