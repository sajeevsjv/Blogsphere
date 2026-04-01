const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", // local dev
      "https://blogsphere01.netlify.app" // deployed frontend
    ],
    credentials: true
  }
});
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected via socket", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

const dotenv = require("dotenv");
dotenv.config();
const mongoConnect = require("./db/connect");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes")
const cors = require("cors");

mongoConnect();

app.use(cors({
  origin: [
    "http://localhost:5173", // local dev
    "https://blogsphere01.netlify.app" // deployed frontend
  ],
  credentials: true
}));

app.get("/test", (req, res) => {
    console.log("test successful");
    res.send("Test successful"); // Send a response
  });

app.use(express.static("../client"));
app.use("/upload",express.static("./upload"));
app.use(express.json({limit : "100mb"}));
app.use(express.urlencoded({extended : true}));

app.use(authRoutes);
app.use(userRoutes);
app.use(blogRoutes);

server.listen(process.env.PORT, ()=>{
    console.log(`server running at http://localhost:${process.env.PORT}`);
});

