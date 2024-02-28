
const socket = io.connect("localhost:3000");

const output = document.getElementById("output");
const feedback = document.getElementById("feedback");
const sender = document.getElementById("sender");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");

let userColors = {}; 
let userAvatars = {}; 

submitBtn.addEventListener("click", () => {
  const userSender = sender.value;
  
  if (!userColors.hasOwnProperty(userSender)) {
    userColors[userSender] = getRandomRainbowColor();
  }
  
  if (!userAvatars.hasOwnProperty(userSender)) {
    userAvatars[userSender] = `https://robohash.org/${userSender}.png?set=set4&size=50x50`;
  }

  socket.emit("chat", {
    sender: userSender,
    message: message.value,
    avatar: userAvatars[userSender],
    color: userColors[userSender],
  });
});

socket.on("chat", (data) => {
  feedback.innerHTML = "";
  output.innerHTML += `<div class="message" style="background-color: ${data.color};">
    <img src="${data.avatar}" alt="Avatar" class="avatar">
    <p><strong>${data.sender}:</strong> ${data.message}</p>
  </div>`;
  
  if (data.sender === sender.value) {
    userColors[data.sender] = data.color;
    message.value = ""; 
  }
});

message.addEventListener("input", () => {
  socket.emit("typing", {
    sender: sender.value,
  });
});

socket.on("typing", (data) => {
  feedback.innerHTML = `<div class="typing-indicator"> ${data.sender} is typing...</div>`;
});

function getRandomRainbowColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 80%, 40%)`; 
}