import express, { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ServerOptions {
  port: number;
  public_path?: string;
}

export class Server {
  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;

  constructor(options: ServerOptions) {
    const { port, public_path = 'public' } = options;
    this.port = port;
    this.publicPath = public_path;
    this.configure();
  }

  private configure() {
    this.app.use(express.json());
    this.app.use(express.urlencoded());

    this.app.use(express.static(this.publicPath));

    // SPA
    this.app.get(/^\/(?!api).*/, (req, res) => {
      const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
      res.sendFile(indexPath);
      return;
    })
  }

  public setRoutes(routes: Router) {
    this.app.use(routes);
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