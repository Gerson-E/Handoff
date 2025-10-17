export function pct(n: number, digits = 0) {
  if (n == null || isNaN(n)) return "–";
  return `${(n * 100).toFixed(digits)}%`;
}

export function ms(n: number) {
  if (n == null || isNaN(n)) return "–";
  return `${Math.round(n)} ms`;
}

export function fmtInt(n: number) {
  if (n == null || isNaN(n)) return "–";
  return new Intl.NumberFormat().format(Math.round(n));
}


