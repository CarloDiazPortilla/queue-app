console.log('Nuevo Ticket HTML');

const lblNewTicketElement = document.querySelector("#lbl-new-ticket");
const addTicketBtn = document.querySelector("button");

const getLastTicketNumber = async () => {
  const response = await fetch("http://localhost:3000/api/ticket/last");
  const data = await response.json();

  lblNewTicketElement.textContent = data.lastTicketNumber;
}

addTicketBtn.addEventListener("click", async () => {
  const response = await fetch("http://localhost:3000/api/ticket/", {
    method: "POST"
  })
  const data = await response.json();

  lblNewTicketElement.textContent = data.number;
})

getLastTicketNumber();