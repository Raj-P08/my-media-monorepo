import {
  MediaEventType,
  MediaEventPayload,
  MediaEventCallback,
  UnsubscribeFunction,
} from './types.js';

export class MediaEventEmitter {
  private listeners: Map<MediaEventType, Set<MediaEventCallback>> = new Map();
  private anyListeners: Set<MediaEventCallback> = new Set();

  constructor(enableConsoleLogger = false) {
    if (enableConsoleLogger) {
      this.attachDefaultConsoleLogger();
    }
  }

  public on(type: MediaEventType, callback: MediaEventCallback): UnsubscribeFunction {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    return () => {
      this.off(type, callback);
    };
  }

  public onAny(callback: MediaEventCallback): UnsubscribeFunction {
    this.anyListeners.add(callback);
    return () => {
      this.anyListeners.delete(callback);
    };
  }

  public off(type: MediaEventType, callback: MediaEventCallback): void {
    const typeSet = this.listeners.get(type);
    if (typeSet) {
      typeSet.delete(callback);
      if (typeSet.size === 0) {
        this.listeners.delete(type);
      }
    }
  }

  public emit(payload: MediaEventPayload): void {
    const typeSet = this.listeners.get(payload.type);
    if (typeSet) {
      typeSet.forEach((cb) => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`[MediaEventEmitter] Error in listener for event '${payload.type}':`, err);
        }
      });
    }

    this.anyListeners.forEach((cb) => {
      try {
        cb(payload);
      } catch (err) {
        console.error('[MediaEventEmitter] Error in wildcard listener:', err);
      }
    });
  }

  public removeAllListeners(): void {
    this.listeners.clear();
    this.anyListeners.clear();
  }

  private attachDefaultConsoleLogger(): void {
    this.onAny((payload) => {
      const emoji = payload.type === 'download' ? '📥' : '👁️';
      console.log(
        `[MediaSDK Event] ${emoji} Type: ${payload.type.toUpperCase()} | Media ID: ${payload.mediaId} (${payload.mediaType}) | Time: ${new Date(payload.timestamp).toISOString()}`
      );
    });
  }
}
