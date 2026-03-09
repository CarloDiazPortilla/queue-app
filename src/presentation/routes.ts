import { Router } from "express";
import { TicketRouter } from "./tickets/routes";

export class ServerRouter {
  static get routes(): Router {
    const router = Router();

    router.use("/api/ticket", TicketRouter.router);

    return router;
  }
}