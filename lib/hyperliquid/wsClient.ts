type SubscriptionHandler<T> = (message: T) => void;

export class HyperliquidWebSocket {
  private ws: WebSocket | null = null;
  private readonly url: string;

  constructor(apiUrl: string) {
    this.url = apiUrl.replace(/^http/, "ws") + "/ws";
  }

  connect() {
    if (typeof window === "undefined") return;
    if (this.ws && this.ws.readyState <= WebSocket.OPEN) return;
    this.ws = new WebSocket(this.url);
  }

  subscribe<T>(payload: unknown, handler: SubscriptionHandler<T>) {
    this.connect();
    if (!this.ws) return () => undefined;

    const onOpen = () => this.ws?.send(JSON.stringify({ method: "subscribe", subscription: payload }));
    const onMessage = (event: MessageEvent) => handler(JSON.parse(event.data) as T);

    this.ws.addEventListener("open", onOpen);
    this.ws.addEventListener("message", onMessage);

    if (this.ws.readyState === WebSocket.OPEN) onOpen();

    return () => {
      this.ws?.removeEventListener("open", onOpen);
      this.ws?.removeEventListener("message", onMessage);
      this.ws?.send(JSON.stringify({ method: "unsubscribe", subscription: payload }));
    };
  }
}
