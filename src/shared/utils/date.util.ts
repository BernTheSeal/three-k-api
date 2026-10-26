const getExpiresAt = (ms: number): Date => new Date(Date.now() + ms);
const hoursToMs = (h: number) => h * 60 * 60 * 1000;
const daysToMs = (d: number) => d * 24 * 60 * 60 * 1000;

export const dateUtil = {
  getExpiresAt,
  hoursToMs,
  daysToMs,
};
