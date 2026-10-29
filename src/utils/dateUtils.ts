export function toLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDaysToDateKey(dateKey: string, days: number): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match || !Number.isInteger(days)) {
    throw new RangeError('A valid YYYY-MM-DD date and whole-day offset are required.');
  }

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    throw new RangeError('The date key is not a valid calendar date.');
  }

  date.setDate(date.getDate() + days);
  return toLocalDateKey(date);
}

export function daysBetweenDateKeys(startDateKey: string, endDateKey: string): number | null {
  const parse = (dateKey: string): number | null => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month || date.getUTCDate() !== day) {
      return null;
    }
    return date.getTime();
  };
  const start = parse(startDateKey);
  const end = parse(endDateKey);
  return start === null || end === null ? null : Math.round((end - start) / 86_400_000);
}

export function localDateKeyFromTimestamp(timestamp: string): string | null {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? null : toLocalDateKey(date);
}
