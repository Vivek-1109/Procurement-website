import { randomUUID } from "crypto";
import { Request, Response, NextFunction } from "express";

export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL";

export interface SentinelLogRecord {
  ts?: string;
  serviceId?: string;
  level: LogLevel;
  message: string;
  requestPath?: string;
  traceId?: string;
  exceptionType?: string;
  stackTrace?: string;
  metadata?: Record<string, any>;
}

export interface SentinelConfig {
  apiUrl: string;
  apiKey: string;
  serviceName: string;
  enabled: boolean;
  batchSize: number;
  flushIntervalMs: number;
  timeoutMs: number;
}

export interface IngestResponse {
  accepted: number;
  duplicates?: number;
  rejected?: Array<{ index: number; reason: string }>;
  createdIncidents?: any[];
  [key: string]: any;
}

declare global {
  namespace Express {
    interface Request {
      traceId?: string;
    }
  }
}

class SentinelClient {
  private config: SentinelConfig;
  private queue: SentinelLogRecord[] = [];
  private timer: NodeJS.Timeout | null = null;
  private isFlushing = false;

  constructor() {
    this.config = this.loadConfig();
  }

  /**
   * Reload configuration dynamically (e.g. after env reload)
   */
  public loadConfig(): SentinelConfig {
    const enabledRaw = process.env.SENTINEL_ENABLED;
    const enabled = enabledRaw ? enabledRaw.toLowerCase() === "true" || enabledRaw === "1" : false;

    this.config = {
      apiUrl:
        process.env.SENTINEL_API_URL ||
        "https://ais-pre-rl5uxygxo452pebz7s3mde-990522198921.asia-east1.run.app/api/v1/logs/ingest",
      apiKey: process.env.SENTINEL_API_KEY || "sentinel_live_wk992a_c41e88f",
      serviceName: process.env.SENTINEL_SERVICE_NAME || "divyanshi-aviation-backend",
      enabled,
      batchSize: Math.min(parseInt(process.env.SENTINEL_BATCH_SIZE || "20", 10) || 20, 500),
      flushIntervalMs: parseInt(process.env.SENTINEL_FLUSH_INTERVAL_MS || "3000", 10) || 3000,
      timeoutMs: parseInt(process.env.SENTINEL_TIMEOUT_MS || "5000", 10) || 5000,
    };
    return this.config;
  }

  public getConfig(): Readonly<SentinelConfig> {
    return this.config;
  }

  /**
   * Queue a log record non-blockingly.
   * Execution returns immediately; transmission occurs in micro-batches in the background.
   */
  public log(entry: SentinelLogRecord): void {
    if (!this.config.enabled) return;

    const formatted: SentinelLogRecord = {
      ts: entry.ts || new Date().toISOString(),
      serviceId: entry.serviceId || this.config.serviceName,
      level: entry.level,
      message: entry.message,
      requestPath: entry.requestPath,
      traceId: entry.traceId,
      exceptionType: entry.exceptionType,
      stackTrace: entry.stackTrace,
      metadata: entry.metadata,
    };

    this.queue.push(formatted);

    // If queue reaches or exceeds micro-batch limit, trigger asynchronous flush immediately
    if (this.queue.length >= this.config.batchSize) {
      this.scheduleFlush(0);
    } else if (!this.timer) {
      this.scheduleFlush(this.config.flushIntervalMs);
    }
  }

  public info(message: string, context?: Partial<SentinelLogRecord>): void {
    this.log({ ...context, level: "INFO", message });
  }

  public warn(message: string, context?: Partial<SentinelLogRecord>): void {
    this.log({ ...context, level: "WARN", message });
  }

  public error(message: string, context?: Partial<SentinelLogRecord>): void {
    this.log({ ...context, level: "ERROR", message });
  }

  public debug(message: string, context?: Partial<SentinelLogRecord>): void {
    this.log({ ...context, level: "DEBUG", message });
  }

  /**
   * Capture an exception/error with parsed stack trace and exception type
   */
  public captureException(err: unknown, context?: Partial<SentinelLogRecord>): void {
    const errorObj = err instanceof Error ? err : new Error(typeof err === "string" ? err : JSON.stringify(err));

    this.log({
      ...context,
      level: "ERROR",
      message: errorObj.message || "Unknown error",
      exceptionType: errorObj.name || (errorObj.constructor ? errorObj.constructor.name : "Error"),
      stackTrace: errorObj.stack,
    });
  }

  private scheduleFlush(delayMs: number): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (delayMs === 0) {
      // Fire asynchronously on next tick without awaiting
      setImmediate(() => {
        this.flush().catch((err) => {
          console.error("[SentinelAI] Background flush error:", err);
        });
      });
    } else {
      this.timer = setTimeout(() => {
        this.timer = null;
        this.flush().catch((err) => {
          console.error("[SentinelAI] Timer flush error:", err);
        });
      }, delayMs);
    }
  }

  /**
   * Flush queued logs to SentinelAI ingestion endpoint.
   * Safely catches any network or HTTP issues so application stability is guaranteed.
   */
  public async flush(): Promise<IngestResponse | null> {
    if (this.queue.length === 0 || this.isFlushing) {
      return null;
    }

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.isFlushing = true;
    const batch = this.queue.splice(0, 500);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (this.config.apiKey) {
        headers["Authorization"] = this.config.apiKey.startsWith("Bearer ")
          ? this.config.apiKey
          : `Bearer ${this.config.apiKey}`;
      }

      const response = await fetch(this.config.apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(batch),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.warn(
          `[SentinelAI] Ingestion endpoint returned HTTP ${response.status}: ${errorText || response.statusText}`,
        );
        return {
          accepted: 0,
          status: response.status,
          error: errorText || response.statusText,
        };
      }

      const data = (await response.json()) as IngestResponse;
      return data;
    } catch (err: any) {
      // Gracefully catch timeout, connection refused, DNS errors, etc.
      console.warn(`[SentinelAI] Log delivery error: ${err?.message || err}`);
      return null;
    } finally {
      this.isFlushing = false;
      // If items accumulated while flushing, schedule next flush
      if (this.queue.length > 0) {
        this.scheduleFlush(this.config.flushIntervalMs);
      }
    }
  }
}

export const sentinel = new SentinelClient();

/**
 * Express Request Logger Middleware
 * Correlates requests via traceId, measures latency, and dispatches log records to SentinelAI.
 */
export const sentinelRequestMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const traceId = (req.headers["x-trace-id"] ||
    req.headers["x-request-id"] ||
    req.headers["x-correlation-id"] ||
    randomUUID()) as string;

  req.traceId = traceId;
  res.setHeader("X-Trace-Id", traceId);

  const startTime = Date.now();

  res.on("finish", () => {
    // Skip noisy static asset / favicon routes if served through express
    if (req.path.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|map|woff2?)$/i)) {
      return;
    }

    const latencyMs = Date.now() - startTime;
    const statusCode = res.statusCode;

    let level: LogLevel = "INFO";
    if (statusCode >= 500) {
      level = "ERROR";
    } else if (statusCode >= 400) {
      level = "WARN";
    }

    // Sanitize query to exclude sensitive keys
    const sanitizedQuery = { ...req.query };
    delete sanitizedQuery.password;
    delete sanitizedQuery.token;
    delete sanitizedQuery.secret;

    sentinel.log({
      level,
      message: `${req.method} ${req.originalUrl || req.path} ${statusCode} (${latencyMs}ms)`,
      requestPath: req.originalUrl || req.path,
      traceId,
      metadata: {
        method: req.method,
        statusCode,
        latencyMs,
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.get("user-agent"),
        query: Object.keys(sanitizedQuery).length > 0 ? sanitizedQuery : undefined,
      },
    });
  });

  next();
};
