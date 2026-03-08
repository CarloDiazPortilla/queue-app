import type { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";

interface WssServerOptions {
  server: Server;
  path?: string;
}

export class WssService {
  private static _instance: WssService;
  private wss: WebSocketServer;

  private constructor(options: WssServerOptions) {
    const { server, path = "/ws" } = options;
    this.wss = new WebSocketServer({ server, path });
    this.start();
  }

  static get instance(): WssService {
    if (!WssService._instance) throw "WssService is not initialized";
    return WssService._instance;
  }

  static initWebsocketServer(options: WssServerOptions) {
    WssService._instance = new WssService(options);
  }

  private start() {
    this.wss.on("connection", (ws: WebSocket) => {
      console.log("Client connected");
      ws.on("close", () => {
        console.log("Client disconnected");
      })
    })
  }
}