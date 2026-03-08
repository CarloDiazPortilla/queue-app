import express, { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { WssService } from "./services/wss.service";
import { createServer } from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ServerOptions {
  port: number;
  routes: Router;
  public_path?: string;
}

export class Server {
  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: ServerOptions) {
    const { port, routes, public_path = 'public' } = options;
    this.port = port;
    this.routes = routes;
    this.publicPath = public_path;
    this.configure();
  }

  private configure() {
    this.app.use(express.json());
    this.app.use(express.urlencoded());

    this.app.use(express.static(this.publicPath));

    // routes
    this.app.use(this.routes);

    // SPA
    this.app.get(/^\/(?!api).*/, (req, res) => {
      const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
      res.sendFile(indexPath);
      return;
    })
  }

  async start() {
    // listen on port
    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    })
  }

  public close() {
    this.serverListener?.close();
  }
}