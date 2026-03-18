import { clsx, type ClassValue } from 'clsx';

/**
 * Utility for conditionally joining Tailwind class names.
 * Wraps clsx — no twMerge needed since we control all class usage.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
