import { io, type Socket } from "socket.io-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventHandler = (...args: any[]) => void;

class ChatSocket {
  private socket: Socket | null = null;
  private planId: string | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;

  connect(planId: string, token: string): Promise<void> {
    if (this.socket && this.planId === planId) {
      return this.socket.connected ? Promise.resolve() : this.awaitConnection();
    }

    this.disconnect();
    this.planId = planId;
    this.reconnectAttempts = 0;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? "";
    this.socket = io(`${wsUrl}/chat`, {
      query: { planId },
      auth: { token },
      reconnectionAttempts: this.maxReconnectAttempts,
      transports: ["websocket"],
    });

    return this.awaitConnection();
  }

  private awaitConnection(): Promise<void> {
    const socket = this.socket;
    if (!socket) return Promise.reject(new Error("Socket not initialized"));

    return new Promise((resolve, reject) => {
      socket.once("connect", () => {
        this.reconnectAttempts = 0;
        resolve();
      });
      socket.on("connect_error", (err) => {
        this.reconnectAttempts += 1;
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(err);
        }
      });
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
    this.planId = null;
  }

  get connected(): boolean {
    return this.socket?.connected ?? false;
  }

  on(event: string, handler: EventHandler): void {
    this.socket?.on(event, handler);
  }

  off(event: string, handler: EventHandler): void {
    this.socket?.off(event, handler);
  }

  send(event: string, data: unknown): void {
    this.socket?.emit(event, data);
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
    this.send("read:receipt", { messageId });
  }
}

export const chatSocket = new ChatSocket();
