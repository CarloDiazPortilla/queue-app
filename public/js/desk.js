
const pendingCounterElem = document.querySelector("#lbl-pending");

async function loadInitialCount() {
  const pendingTickets = await fetch("http://localhost:3000/api/ticket/pending").then(resp => resp.json());
  pendingCounterElem.textContent = pendingTickets.length || 0;
}

function connectToWebSockets() {

  const socket = new WebSocket('ws://localhost:3000/ws');

  socket.onmessage = (event) => {
    console.log(event.data);
    const { type, payload } = JSON.parse(event.data);
    if (type !== "on-ticked-count-changed") return;
    pendingCounterElem.textContent = payload;
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
