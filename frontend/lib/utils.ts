import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n < 1000) return n.toFixed(n < 10 ? 1 : 0);
  const units = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi'];
  let u = 0;
  let v = n;
  while (v >= 1000 && u < units.length - 1) {
    v /= 1000;
    u++;
  }
  return v.toFixed(2) + units[u];
}

export function backendUrl(): string {
  // Prefer Next.js public env, then legacy CRA env (proxied via next.config).
  return (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    (process.env.REACT_APP_BACKEND_URL as string) ||
    ''
  );
}
