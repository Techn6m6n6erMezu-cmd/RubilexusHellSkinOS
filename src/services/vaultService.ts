export const VAULT_WS_URL = 'ws://192.168.4.1:9090';
export const VAULT_HTTP_URL = 'http://192.168.4.1:9090/status';
export const RECONNECT_INTERVAL_MS = 30000;
export const CONNECT_TIMEOUT_MS = 5000;

export type VaultConnectionState = 'idle' | 'connecting' | 'online' | 'offline';

export interface VaultMetrics {
  nodeCount: number;
  cpuLoad: number[];
  memUsedMB: number[];
  totalMemMB: number[];
  uptime: number;
  activeJobs: number;
  clusterTemp: number[];
}

export interface VaultStatus {
  state: VaultConnectionState;
  error: string | null;
  metrics: VaultMetrics | null;
  lastAttempt: Date | null;
  lastOnline: Date | null;
}

export function createVaultConnection(onStatus: (s: VaultStatus) => void): () => void {
  let ws: WebSocket | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let retryId: ReturnType<typeof setTimeout> | null = null;
  let destroyed = false;

  const emit = (patch: Partial<VaultStatus>, prev: VaultStatus): VaultStatus => {
    const next = { ...prev, ...patch };
    onStatus(next);
    return next;
  };

  let current: VaultStatus = {
    state: 'idle',
    error: null,
    metrics: null,
    lastAttempt: null,
    lastOnline: null,
  };

  const scheduleRetry = () => {
    if (destroyed) return;
    retryId = setTimeout(connect, RECONNECT_INTERVAL_MS);
  };

  const connect = () => {
    if (destroyed) return;

    if (timeoutId) clearTimeout(timeoutId);
    if (retryId) clearTimeout(retryId);
    if (ws) { try { ws.close(); } catch { /* ignore */ } }

    current = emit({ state: 'connecting', error: null, lastAttempt: new Date() }, current);

    try {
      ws = new WebSocket(VAULT_WS_URL);
    } catch (e) {
      current = emit({
        state: 'offline',
        error: 'Hardware Offline — Unable to open socket',
        lastAttempt: new Date(),
      }, current);
      scheduleRetry();
      return;
    }

    timeoutId = setTimeout(() => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        try { ws?.close(); } catch { /* ignore */ }
        current = emit({
          state: 'offline',
          error: 'Hardware Offline — Pi cluster not responding (timeout)',
          lastAttempt: new Date(),
        }, current);
        scheduleRetry();
      }
    }, CONNECT_TIMEOUT_MS);

    ws.onopen = () => {
      if (timeoutId) clearTimeout(timeoutId);
      current = emit({ state: 'online', error: null, lastOnline: new Date() }, current);
    };

    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data) as VaultMetrics;
        current = emit({ metrics: data, lastOnline: new Date() }, current);
      } catch { /* ignore malformed frames */ }
    };

    ws.onerror = () => {
      if (timeoutId) clearTimeout(timeoutId);
      current = emit({
        state: 'offline',
        error: 'Hardware Offline — Connection refused by Pi cluster',
        lastAttempt: new Date(),
      }, current);
      scheduleRetry();
    };

    ws.onclose = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (!destroyed && current.state === 'online') {
        current = emit({
          state: 'offline',
          error: 'Hardware Offline — Cluster disconnected',
          lastAttempt: new Date(),
        }, current);
        scheduleRetry();
      }
    };
  };

  connect();

  return () => {
    destroyed = true;
    if (timeoutId) clearTimeout(timeoutId);
    if (retryId) clearTimeout(retryId);
    if (ws) { try { ws.close(); } catch { /* ignore */ } }
  };
}
