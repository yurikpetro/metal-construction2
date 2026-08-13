const hits = new Map<string, number[]>();

/** Простой rate-limit в памяти процесса — достаточно для небольшого сайта на одном сервере. */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  if (hits.size > 5000) {
    for (const [k, timestamps] of hits) {
      if (timestamps.every((t) => now - t > windowMs)) hits.delete(k);
    }
  }

  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  hits.set(key, timestamps);

  return timestamps.length > limit;
}
