/**
 * Intelligent Caching Service
 *
 * Provides TTL-based caching with:
 * - Chain ID namespacing (prevents testnet/mainnet collisions)
 * - In-flight request deduplication
 * - LRU eviction
 * - Pattern-based invalidation
 * - Performance statistics tracking
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // milliseconds, -1 = infinite
}

export interface CacheConfig {
  enabled: boolean;
  defaultTTL: number;
  maxEntries: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  entries: number;
  hitRate: number;
}

/**
 * Cache Manager with chain ID namespacing and statistics
 */
export class CacheManager {
  private cache: Map<string, CacheEntry<unknown>>;
  private config: CacheConfig;
  private inFlightRequests: Map<string, Promise<unknown>>;
  private stats: { hits: number; misses: number };
  private chainId: number;

  constructor(chainId: number, config?: Partial<CacheConfig>) {
    this.cache = new Map();
    this.inFlightRequests = new Map();
    this.stats = { hits: 0, misses: 0 };
    this.chainId = chainId;
    this.config = {
      enabled: true,
      defaultTTL: 60_000, // 60 seconds
      maxEntries: 500,
      ...config,
    };
  }

  /**
   * Get cached data or execute fetcher
   *
   * @param key - Cache key (will be prefixed with chain ID)
   * @param fetcher - Async function to fetch data if not cached
   * @param ttl - Time-to-live in milliseconds (-1 for infinite)
   */
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    if (!this.config.enabled) {
      return fetcher();
    }

    // Namespace cache key with chain ID to prevent testnet/mainnet collisions
    const namespacedKey = `${this.chainId}:${key}`;

    // Check cache
    const cached = this.cache.get(namespacedKey);
    if (cached && !this.isExpired(cached)) {
      this.stats.hits++;
      return cached.data as T;
    }

    this.stats.misses++;

    // Check in-flight requests (deduplication)
    if (this.inFlightRequests.has(namespacedKey)) {
      return this.inFlightRequests.get(namespacedKey) as Promise<T>;
    }

    // Execute fetcher
    const promise = fetcher();
    this.inFlightRequests.set(namespacedKey, promise);

    try {
      const data = await promise;
      this.set(namespacedKey, data, ttl ?? this.config.defaultTTL);
      return data;
    } finally {
      this.inFlightRequests.delete(namespacedKey);
    }
  }

  /**
   * Manually set cache entry (used for smart TTL updates)
   */
  set(key: string, data: unknown, ttl: number): void {
    // Namespace if not already namespaced
    const namespacedKey = key.includes(':') ? key : `${this.chainId}:${key}`;

    // Enforce max entries (LRU eviction)
    if (this.cache.size >= this.config.maxEntries) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(namespacedKey, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Check if cache entry has expired
   */
  private isExpired(entry: CacheEntry<unknown>): boolean {
    if (entry.ttl === -1) return false; // Infinite TTL
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Invalidate cache entries by pattern
   *
   * @param keyPattern - Regex pattern to match keys (omit for clear all)
   *
   * @example
   * ```typescript
   * // Invalidate all subscription status for a specific plan
   * cacheManager.invalidate('subscription-status:1:');
   *
   * // Invalidate all user subscriptions
   * cacheManager.invalidate('my-subscriptions:');
   *
   * // Clear all cache
   * cacheManager.invalidate();
   * ```
   */
  invalidate(keyPattern?: string): void {
    if (!keyPattern) {
      this.cache.clear();
      return;
    }

    // Match against namespaced keys (chainId:pattern)
    const namespacedPattern = `${this.chainId}:${keyPattern}`;
    const regex = new RegExp(namespacedPattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache entries and reset statistics
   */
  clear(): void {
    this.cache.clear();
    this.inFlightRequests.clear();
    this.stats = { hits: 0, misses: 0 };
  }

  /**
   * Get cache performance statistics
   *
   * @returns Cache stats including hit rate
   *
   * @example
   * ```typescript
   * const stats = cacheManager.getStats();
   * console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
   * console.log(`RPC savings: ${stats.hits} calls avoided`);
   * ```
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      entries: this.cache.size,
      hitRate: total > 0 ? this.stats.hits / total : 0,
    };
  }
}
