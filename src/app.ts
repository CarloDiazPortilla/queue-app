import { EnvironmentAdapter } from "./config/environment.adapter";
import { ServerRouter } from "./presentation/routes";
import { Server } from "./presentation/server";
import { createServer } from "http";
import { WssService } from "./presentation/services/wss.service";

(async () => {
  await main();
})()

async function main() {
  const server = new Server({
    port: EnvironmentAdapter.envs.PORT,
  });

  const httpServer = createServer(server.app);

  WssService.initWebsocketServer({
    server: httpServer
  });

  server.setRoutes(ServerRouter.routes)

  const PORT = EnvironmentAdapter.envs.PORT;

  httpServer.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
  });
}