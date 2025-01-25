import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv"; // Correct way to import dotenv for ES Modules
dotenv.config(); // Load environment variables from .env
// Use the port from .env or fallback to 5000
const port = process.env.PORT || 5000;
let AllUsers = {};
const app = express();
const server = createServer(app);
const io = new Server(server);
// Get the directory name of the current module (for serving files)
const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve static files from the public folder
app.use(express.static(join(__dirname, "public")));

// Serve the index.html file when accessing the root URL
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "app", "index.html"));
});

// Handle socket connection
io.on("connection", (socket) => {
  //   console.log(`User: ${socket.id} connected`);
  socket.on("user-joined", (user) => {
    console.log(user, "joined the chat room");
    AllUsers[socket.id] = user;
    let emailBhejnewala = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      server: "gmail",
      auth: {
        user: "chandfakoo2@gmail.com",
        pass: "dfdr faqk ubtx rivb",
      },
    });
    let mailDetails = {
      from: "chandfakoo2@gmail.com",
      to: "fakoochand@gmail.com",
      subject: `${user} has joined chat room..`,
      text: "Change to html view to see info",
      html: `${user} has joined the chat room and is waiting for you...
      <a href="https://simple-chat.onrender.com">click here</a> to join :>`,
    };
    emailBhejnewala
      .sendMail(mailDetails)
      .then((info) => {
        console.log(info.messageId);
        // return res.status(201).json({
        //   msg: "Mail Sent successfully . Kindly check your inbox",
        //   info: info.messageId,
        //   acceptResponse: info.accepted,
        // });
      })
      .catch((error) => {
        // res.status(500).json({ error });
        console.log(error.message);
      });
  });
  socket.on("message", (message) => {
    // console.log(message)
    socket.broadcast.emit("message", message);
  });
  socket.on("disconnect", () => {
    console.log("user " + AllUsers[socket.id] + " has disconnected");
    socket.broadcast.emit("user-disconnected", AllUsers[socket.id]);
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
