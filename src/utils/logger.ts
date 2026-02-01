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

export interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: number;
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
  private performanceMetrics: PerformanceMetric[] = [];
  private correlationIdCounter = 0;

  configure(config: Partial<LoggerConfig>) {
    if (config.level !== undefined) this.level = config.level;
    if (config.prefix !== undefined) this.prefix = config.prefix;
  }

  getLevel(): LogLevel {
    return this.level;
  }

  /**
   * Generate unique correlation ID for tracing related operations
   */
  generateCorrelationId(): string {
    return `${Date.now()}-${++this.correlationIdCounter}`;
  }

  /**
   * Track performance of async operations (debug mode only)
   */
  async trackPerformance<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    if (this.level !== 'debug') {
      return fn(); // Skip tracking if not in debug mode
    }

    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;

      this.performanceMetrics.push({ operation, duration, timestamp: Date.now() });
      this.debug(`⏱️ ${operation}: ${duration.toFixed(2)}ms`);

      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.debug(`⏱️ ${operation}: ${duration.toFixed(2)}ms (failed)`);
      throw error;
    }
  }

  /**
   * Get performance metrics (debug mode only)
   */
  getPerformanceMetrics(): PerformanceMetric[] {
    return [...this.performanceMetrics];
  }

  /**
   * Clear performance metrics
   */
  clearMetrics(): void {
    this.performanceMetrics = [];
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
