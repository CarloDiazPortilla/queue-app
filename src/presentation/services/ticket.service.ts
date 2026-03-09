import { UuidAdapter } from "../../config/uuid.adapter";
import type { Ticket } from "../../domain/interfaces/ticket";
import { WssService } from "./wss.service";

export class TicketService {

  readonly tickets: Ticket[] = [
    {
      id: UuidAdapter.v4(),
      number: 1,
      createdAt: new Date(),
      done: false
    },
    {
      id: UuidAdapter.v4(),
      number: 2,
      createdAt: new Date(),
      done: false
    },
    {
      id: UuidAdapter.v4(),
      number: 3,
      createdAt: new Date(),
      done: false
    },
    {
      id: UuidAdapter.v4(),
      number: 4,
      createdAt: new Date(),
      done: false
    },
    {
      id: UuidAdapter.v4(),
      number: 5,
      createdAt: new Date(),
      done: false
    },
    {
      id: UuidAdapter.v4(),
      number: 6,
      createdAt: new Date(),
      done: false
    },
  ];

  private readonly workingOnTickets: Ticket[] = []

  constructor(
    private readonly wssService = WssService.instance,
  ) { }

  public get pendingTickets(): Ticket[] {
    return this.tickets.filter(filter => !filter.handleAtDesk);
  }

  public get lastWorkingOnTickets(): Ticket[] {
    return this.workingOnTickets.splice(0, 3);
  }

  public get lastTicketNumber(): number {
    return this.tickets.length > 0 ? this.tickets.at(-1)!.number : 0;
  }

  public createTicket() {
    const ticket: Ticket = {
      id: UuidAdapter.v4(),
      createdAt: new Date(),
      done: false,
      number: this.lastTicketNumber + 1,
    }

    this.tickets.push(ticket);

    this.onTicketNumberChanged();

    return ticket;
  }

  public drawTicket(desk: string): { status: string, ticket: Ticket | undefined, message: string } {
    const ticket = this.tickets.find(ticket => !ticket.handleAtDesk);
    if (!ticket) return { status: "error", message: "No pending tickets", ticket: undefined }

    ticket.handleAtDesk = desk;
    ticket.handleAt = new Date();

    this.workingOnTickets.unshift({ ...ticket });

    // TODO: notify websocket ticket has been handle by desk

    return {
      status: "ok",
      ticket: ticket,
      message: `Ticket successfully set at desk ${desk}`
    }
  }

  public finishTicket(id: string) {
    const ticket = this.tickets.find(ticket => ticket.id === id);
    if (!ticket) return { status: "error", message: "Couldn't find ticket" };

    ticket.done = true;

    return {
      message: "Ticket successfully set to done",
      ticket: ticket,
      status: "ok"
    }
  }

  private onTicketNumberChanged() {
    this.wssService.sendMessage("on-ticked-count-changed", this.pendingTickets.length)
  }
}