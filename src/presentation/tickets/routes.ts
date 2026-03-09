import { Router } from "express";
import { TicketController } from "./controller";
import { TicketService } from "../services/ticket.service";

export class TicketRouter {
  static get router() {
    const router = Router();
    const ticketService = new TicketService();
    const controller = new TicketController(ticketService);

    router.get("/", controller.getTickets);
    router.get("/last", controller.getLastTicketNumber);
    router.get("/pending", controller.getPendingTickets);
    router.get("/draw/:desk", controller.drawTicket);
    router.get("/working-on", controller.getWorkingOnTicket);

    router.post("/", controller.createTicket);

    router.put("/done/:ticketId", controller.ticketFinished);

    return router;
  }
}