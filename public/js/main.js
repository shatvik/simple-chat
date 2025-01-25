let socket = io();
let user;

window.addEventListener("load", () => {
  user = prompt("Enter your name");
  alert(user + " joined the chat room.. notifying Shatvik");
  socket.emit("user-joined", user);
});

const sendbtn = document.getElementById("send-btn");
const chatvalue = document.getElementById("chat");
let chats = document.querySelector(".chats");
sendbtn.addEventListener("click", () => {
  if (chatvalue.value.trim() !== "") {
    const chatText = document.createElement("li");
    chatText.classList.add("userB");
    chatText.innerText = chatvalue.value;
    socket.emit("message", chatvalue.value);
    chatvalue.value = "";
    chats.appendChild(chatText);
    chats.scrollTop = chats.scrollHeight;
  }
});

socket.on("message", (message) => {
  let msgText = document.createElement("li");
  msgText.classList.add("userA");
  msgText.innerText = message;
  chats.appendChild(msgText);
  chats.scrollTop = chats.scrollHeight;
});

socket.on("user-disconnected", (username) => {
  alert(username + " disconnected.. Thank you have a nice day");
});
