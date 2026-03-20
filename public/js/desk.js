
const pendingCounterElem = document.querySelector("#lbl-pending");
const deskNameElem = document.querySelector("#desk-name");
const noTicketsAlertElem = document.querySelector(".alert");
const serveTicketBtn = document.getElementById("btn-serve-ticket");
const finishTicketBtn = document.getElementById("btn-finish-ticket");
const currentWorkingTicketElem = document.getElementById("working-ticket");

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
  window.location = "index.html";
  throw new Error("desk required");
}

const deskName = searchParams.get("escritorio");
deskNameElem.textContent = deskName;

let currentWorkingTicket = null;

async function loadInitialCount() {
  const pendingTickets = await fetch("http://localhost:3000/api/ticket/pending").then(resp => resp.json());
  checkTicketCount(pendingTickets.length);
}

async function getTicket() {
  const response = await fetch(`http://localhost:3000/api/ticket/draw/${deskName}`);
  const { status, ticket, message } = await response.json();

  console.log({ status, ticket, message })
  if (status === "error") {
    currentWorkingTicketElem.textContent = message;
    return;
  }
  currentWorkingTicket = ticket;
  currentWorkingTicketElem.textContent = ticket.number;
}

function checkTicketCount(currentCount = 0) {
  if (currentCount === 0) {
    noTicketsAlertElem.classList.remove("d-none");
  } else {
    noTicketsAlertElem.classList.add("d-none");
  }
  pendingCounterElem.textContent = currentCount;
}

function connectToWebSockets() {

  const socket = new WebSocket('ws://localhost:3000/ws');

  socket.onmessage = (event) => {
    console.log(event.data);
    const { type, payload } = JSON.parse(event.data);
    if (type !== "on-ticked-count-changed") return;
    checkTicketCount(payload);
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

serveTicketBtn.addEventListener("click", getTicket)

loadInitialCount();
connectToWebSockets();
