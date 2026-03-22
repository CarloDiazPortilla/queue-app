async function getWorkingOnTickets() {
  const response = await fetch("http://localhost:3000/api/ticket/working-on");
  return response.json();
}

async function showTicketAndDesk(workingOnTickets) {
  console.log(workingOnTickets)
  workingOnTickets.forEach((ticket, index) => {
    if (index > 3) return;
    const ticketElem = document.getElementById(`lbl-ticket-0${index + 1}`);
    const deskElem = document.getElementById(`lbl-desk-0${index + 1}`);

    ticketElem.textContent = `Ticket ${ticket.number}`;
    deskElem.textContent = ticket.handleAtDesk;
  })
}

function connectToWebSockets() {

  const socket = new WebSocket('ws://localhost:3000/ws');

  socket.onmessage = (event) => {
    console.log(event.data);
    const { type, payload } = JSON.parse(event.data);
    if (type !== "on-working-on-tickets-changed") return;
    showTicketAndDesk(payload);
  };

  socket.onclose = (event) => {
    console.log('Connection closed');
    setTimeout(() => {
      console.log('retrying to connect');
      connectToWebSockets();
    }, 1500);

  };

  socket.onopen = (event) => {
    console.log('Connected');
  };

}

connectToWebSockets();
getWorkingOnTickets()
  .then(workingOnTickets => showTicketAndDesk(workingOnTickets))
  .catch(err => console.log(err));