async function getWorkingOnTickets() {
  const response = await fetch("http://localhost:3000/api/ticket/working-on");
  return response.json();
}

async function showTicketAndDesk(workingOnTickets) {
  console.log(workingOnTickets)
  workingOnTickets.forEach((ticket, index) => {
    const ticketElem = document.getElementById(`lbl-ticket-0${index + 1}`);
    const deskElem = document.getElementById(`lbl-desk-0${index + 1}`);

    ticketElem.textContent = `Ticket ${ticket.number}`;
    deskElem.textContent = ticket.handleAtDesk;
  })
}

getWorkingOnTickets()
  .then(workingOnTickets => showTicketAndDesk(workingOnTickets))
  .catch(err => console.log(err));