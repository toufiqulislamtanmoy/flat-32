// The chat backend is a raw `ws` server (src/websocket/chatServer.ts), not
// Socket.IO — it speaks a plain `{ event, payload }` JSON envelope over a
// native WebSocket, authenticated via a `user_id` query param (no JWT yet).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventHandler = (payload: any) => void;
type StatusHandler = (connected: boolean) => void;

interface ServerEnvelope {
  event: string;
  payload: unknown;
}

const RECONNECT_DELAY_MS = 1500;

class ChatSocket {
  private socket: WebSocket | null = null;
  private planId: string | null = null;
  private userId: string | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private manuallyClosed = true;
  private listeners = new Map<string, Set<EventHandler>>();
  private statusListeners = new Set<StatusHandler>();

  connect(planId: string, userId: string): Promise<void> {
    if (this.socket && this.planId === planId && this.userId === userId) {
      if (this.socket.readyState === WebSocket.OPEN) return Promise.resolve();
      if (this.socket.readyState === WebSocket.CONNECTING) return this.awaitOpen(this.socket);
    }

    this.teardownSocket();
    this.manuallyClosed = false;
    this.planId = planId;
    this.userId = userId;
    this.reconnectAttempts = 0;

    return this.openSocket();
  }

  private openSocket(): Promise<void> {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? "";
    const socket = new WebSocket(
      `${wsUrl}/ws/chat/${this.planId}?user_id=${encodeURIComponent(this.userId ?? "")}`
    );
    this.socket = socket;

    socket.addEventListener("message", (event) => {
      let parsed: ServerEnvelope | null = null;
      try {
        parsed = JSON.parse(event.data);
      } catch {
        return;
      }
      if (!parsed?.event) return;
      this.listeners.get(parsed.event)?.forEach((handler) => handler(parsed.payload));
    });

    socket.addEventListener("open", () => {
      this.reconnectAttempts = 0;
      this.emitStatus(true);
    });

    socket.addEventListener("close", () => {
      this.emitStatus(false);
      if (!this.manuallyClosed) this.scheduleReconnect();
    });

    return this.awaitOpen(socket);
  }

  private awaitOpen(socket: WebSocket): Promise<void> {
    return new Promise((resolve, reject) => {
      const handleOpen = () => {
        cleanup();
        resolve();
      };
      const handleError = () => {
        cleanup();
        reject(new Error("WebSocket connection failed"));
      };
      const cleanup = () => {
        socket.removeEventListener("open", handleOpen);
        socket.removeEventListener("error", handleError);
      };
      socket.addEventListener("open", handleOpen);
      socket.addEventListener("error", handleError);
    });
  }

  private scheduleReconnect(): void {
    if (!this.planId || !this.userId) return;
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;

    this.reconnectAttempts += 1;
    this.reconnectTimer = setTimeout(() => {
      this.openSocket().catch(() => {
        // swallowed — "close" will fire too and schedule the next attempt
      });
    }, RECONNECT_DELAY_MS);
  }

  private teardownSocket(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    this.socket?.close();
    this.socket = null;
  }

  disconnect(): void {
    this.manuallyClosed = true;
    this.planId = null;
    this.userId = null;
    this.teardownSocket();
  }

  get connected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  onStatusChange(handler: StatusHandler): () => void {
    this.statusListeners.add(handler);
    return () => this.statusListeners.delete(handler);
  }

  private emitStatus(connected: boolean): void {
    this.statusListeners.forEach((handler) => handler(connected));
  }

  on(event: string, handler: EventHandler): void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)?.add(handler);
  }

  off(event: string, handler: EventHandler): void {
    this.listeners.get(event)?.delete(handler);
  }

  send(event: string, payload: unknown): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ event, payload }));
    }
  }

  sendMessage(content: string, tempId: string): void {
    this.send("message:send", { content, tempId });
  }

  startTyping(): void {
    this.send("typing:start", {});
  }

  stopTyping(): void {
    this.send("typing:stop", {});
  }

  markRead(messageId: string): void {
    this.send("read", { messageId });
  }
}

export const chatSocket = new ChatSocket();
