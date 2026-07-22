export const getExpiresAt = (ms: number): Date => new Date(Date.now() + ms);
export const HOURS = (h: number) => h * 60 * 60 * 1000;
export const DAYS = (d: number) => d * 24 * 60 * 60 * 1000;
