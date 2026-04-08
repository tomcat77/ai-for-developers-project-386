import { format } from 'date-fns';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

export class TimezoneUtils {
  static formatLocal(date: string | Date, pattern: string = 'dd.MM.yyyy HH:mm'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, pattern);
  }

  static formatDateOnly(date: string | Date): string {
    return this.formatLocal(date, 'dd.MM.yyyy');
  }

  static formatTimeOnly(date: string | Date): string {
    return this.formatLocal(date, 'HH:mm');
  }

  static toISOString(date: Date): string {
    return date.toISOString();
  }

  static getUserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  static formatInUserTimezone(date: string | Date, pattern: string = 'dd.MM.yyyy HH:mm'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return formatInTimeZone(d, this.getUserTimezone(), pattern);
  }
}