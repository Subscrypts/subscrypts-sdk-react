/**
 * Subscrypts SDK Logger
 *
 * Configurable logging with three levels:
 * - silent: No output (production)
 * - info: User-friendly status messages
 * - debug: Full developer debugging info
 */

export type LogLevel = 'silent' | 'info' | 'debug';

export interface LoggerConfig {
  level: LogLevel;
  prefix?: string;
}

const LOG_STYLES = {
  info: 'color: #3B82F6; font-weight: bold;',      // Blue
  debug: 'color: #8B5CF6; font-weight: bold;',     // Purple
  warn: 'color: #F59E0B; font-weight: bold;',      // Orange
  error: 'color: #EF4444; font-weight: bold;',     // Red
  success: 'color: #10B981; font-weight: bold;',   // Green
};

class SubscryptsLogger {
  private level: LogLevel = 'info';
  private prefix = '[Subscrypts]';

  configure(config: Partial<LoggerConfig>) {
    if (config.level !== undefined) this.level = config.level;
    if (config.prefix !== undefined) this.prefix = config.prefix;
  }

  getLevel(): LogLevel {
    return this.level;
  }

  private shouldLog(minLevel: LogLevel): boolean {
    if (this.level === 'silent') return false;
    if (this.level === 'debug') return true;
    if (this.level === 'info' && minLevel !== 'debug') return true;
    return false;
  }

  /**
   * Debug level - detailed developer info
   */
  debug(message: string, data?: unknown) {
    if (this.shouldLog('debug')) {
      console.log(`%c${this.prefix} DEBUG:`, LOG_STYLES.debug, message, data !== undefined ? data : '');
    }
  }

  /**
   * Info level - user-friendly status
   */
  info(message: string, data?: unknown) {
    if (this.shouldLog('info')) {
      console.log(`%c${this.prefix}`, LOG_STYLES.info, message, data !== undefined ? data : '');
    }
  }

  /**
   * Warning - potential issues
   */
  warn(message: string, data?: unknown) {
    if (this.shouldLog('info')) {
      console.warn(`%c${this.prefix} WARNING:`, LOG_STYLES.warn, message, data !== undefined ? data : '');
    }
  }

  /**
   * Error - failures
   */
  error(message: string, data?: unknown) {
    if (this.shouldLog('info')) {
      console.error(`%c${this.prefix} ERROR:`, LOG_STYLES.error, message, data !== undefined ? data : '');
    }
  }

  /**
   * Success - completed operations
   */
  success(message: string, data?: unknown) {
    if (this.shouldLog('info')) {
      console.log(`%c${this.prefix} ✓`, LOG_STYLES.success, message, data !== undefined ? data : '');
    }
  }

  /**
   * Group logs together (debug only)
   */
  group(label: string) {
    if (this.shouldLog('debug')) {
      console.group(`${this.prefix} ${label}`);
    }
  }

  groupEnd() {
    if (this.shouldLog('debug')) {
      console.groupEnd();
    }
  }

  /**
   * Log a table of data (debug only)
   */
  table(data: unknown) {
    if (this.shouldLog('debug')) {
      console.table(data);
    }
  }
}

// Singleton instance
export const logger = new SubscryptsLogger();

/**
 * Helper to format BigInt values for logging
 * Converts BigInt to string to avoid JSON serialization issues
 */
export function formatLogValue(value: unknown): unknown {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return value.map(formatLogValue);
  }
  if (value && typeof value === 'object') {
    const formatted: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      formatted[k] = formatLogValue(v);
    }
    return formatted;
  }
  return value;
}
