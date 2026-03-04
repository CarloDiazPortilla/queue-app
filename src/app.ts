import { EnvironmentAdapter } from "./config/environment.adapter.js";
import { ServerRouter } from "./presentation/routes.js";
import { Server } from "./presentation/server.js";

(async () => {
  await main();
})()

async function main() {
  new Server({
    port: EnvironmentAdapter.envs.PORT,
    routes: ServerRouter.routes,
  }).start();
}