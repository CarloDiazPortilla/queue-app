import type { Request, Response } from "express";
import type { TicketService } from "../services/ticket.service";

export class TicketController {
  constructor(
    private readonly ticketService: TicketService
  ) { }

  public getTickets = async (req: Request, res: Response) => {
    const tickets = this.ticketService.tickets;

    return res.json(tickets);
  }

  public getLastTicketNumber = async (req: Request, res: Response) => {
    const lastTicketNumber = this.ticketService.lastTicketNumber;

    return res.json(lastTicketNumber)
  }

  public getPendingTickets = async (req: Request, res: Response) => {
    const pendingTickets = this.ticketService.pendingTickets;

    return res.json(pendingTickets)
  }

  public createTicket = async (req: Request, res: Response) => {
    const ticket = this.ticketService.createTicket();

    return res.status(201).json(ticket)
  }

  public drawTicket = async (req: Request, res: Response) => {
    const { desk } = req.params;
    if (typeof desk === "string") {
      const response = this.ticketService.drawTicket(desk)
      return res.json(response);
    }

    return res.status(400).json("desk param was not sent");

  }

  public ticketFinished = async (req: Request, res: Response) => {
    const { ticketId } = req.params;

    if (typeof ticketId === "string") {
      const response = this.ticketService.finishTicket(ticketId);
      return res.json(response);
    }

    return res.status(400).json("ticketId param was not sent");
  }

  public getWorkingOnTicket = async (req: Request, res: Response) => {
    const workingOnTickets = this.ticketService.lastWorkingOnTickets;

    return res.json(workingOnTickets);
  }
}