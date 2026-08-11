export class MediaEventEmitter {
    listeners = new Map();
    anyListeners = new Set();
    constructor(enableConsoleLogger = false) {
        if (enableConsoleLogger) {
            this.attachDefaultConsoleLogger();
        }
    }
    on(type, callback) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type).add(callback);
        return () => {
            this.off(type, callback);
        };
    }
    onAny(callback) {
        this.anyListeners.add(callback);
        return () => {
            this.anyListeners.delete(callback);
        };
    }
    off(type, callback) {
        const typeSet = this.listeners.get(type);
        if (typeSet) {
            typeSet.delete(callback);
            if (typeSet.size === 0) {
                this.listeners.delete(type);
            }
        }
    }
    emit(payload) {
        const typeSet = this.listeners.get(payload.type);
        if (typeSet) {
            typeSet.forEach((cb) => {
                try {
                    cb(payload);
                }
                catch (err) {
                    console.error(`[MediaEventEmitter] Error in listener for event '${payload.type}':`, err);
                }
            });
        }
        this.anyListeners.forEach((cb) => {
            try {
                cb(payload);
            }
            catch (err) {
                console.error('[MediaEventEmitter] Error in wildcard listener:', err);
            }
        });
    }
    removeAllListeners() {
        this.listeners.clear();
        this.anyListeners.clear();
    }
    attachDefaultConsoleLogger() {
        this.onAny((payload) => {
            const emoji = payload.type === 'download' ? '📥' : '👁️';
            console.log(`[MediaSDK Event] ${emoji} Type: ${payload.type.toUpperCase()} | Media ID: ${payload.mediaId} (${payload.mediaType}) | Time: ${new Date(payload.timestamp).toISOString()}`);
        });
    }
}
//# sourceMappingURL=events.js.map