
const pendingCounterElem = document.querySelector("#lbl-pending");
const deskNameElem = document.querySelector("#desk-name")
const noTicketsAlertElem = document.querySelector(".alert")

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
  window.location = "index.html";
  throw new Error("desk required");
}

const deskName = searchParams.get("escritorio");
deskNameElem.textContent = deskName;

async function loadInitialCount() {
  const pendingTickets = await fetch("http://localhost:3000/api/ticket/pending").then(resp => resp.json());
  checkTicketCount(pendingTickets.length);
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

loadInitialCount();
connectToWebSockets();
