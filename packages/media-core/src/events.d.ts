import { MediaEventType, MediaEventPayload, MediaEventCallback, UnsubscribeFunction } from './types.js';
export declare class MediaEventEmitter {
    private listeners;
    private anyListeners;
    constructor(enableConsoleLogger?: boolean);
    on(type: MediaEventType, callback: MediaEventCallback): UnsubscribeFunction;
    onAny(callback: MediaEventCallback): UnsubscribeFunction;
    off(type: MediaEventType, callback: MediaEventCallback): void;
    emit(payload: MediaEventPayload): void;
    removeAllListeners(): void;
    private attachDefaultConsoleLogger;
}
//# sourceMappingURL=events.d.ts.map