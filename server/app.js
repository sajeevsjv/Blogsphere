const express = require('express');
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoConnect = require("./db/connect");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const blogs = require("./db/models/blogs");

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],        // Allowed methods
    credentials: true,               // Allow cookies if needed
  },
});

mongoConnect();

app.use(cors());

app.get("/test", (req, res) => {
  console.log("test successful");
  res.send("Test successful");
});

// Static files and parsing middleware
app.use(express.static("../client"));
app.use("/upload", express.static("./upload"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(authRoutes);
app.use(userRoutes);
app.use(blogRoutes);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle new comment
  socket.on("newComment", async (commentData) => {
    try {
      console.log("New comment:", commentData);
      const { blogId, comment, author } = commentData;

      // Ensure that the update is awaited properly
      const updatedBlog = await blogs.findByIdAndUpdate(
        blogId,
        {
          $push: {
            comments: { comment, author, date: new Date() },
          },
        },
        { new: true } // Return the updated document
      );

      // Broadcast the updated comment to all clients
      const latestComment = updatedBlog.comments[updatedBlog.comments.length - 1];
      io.emit("commentAdded", { blogId, comment: latestComment });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});


// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
