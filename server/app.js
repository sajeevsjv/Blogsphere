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
const Comment = require("./db/models/comments"); // Import the Comment model
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],        // Allowed methods
    credentials: true,               // Allow cookies if needed
  },
});

// Connect to MongoDB
mongoConnect();

// Middleware setup
app.use(cors());
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

  // Handle new comment or reply
  // working code ......
  socket.on("newComment", async (commentData) => {
    try {
      const { blogId, comment, author, parentId } = commentData;

      // Log incoming data
      console.log("Received new comment/reply data:", commentData);

      // Check if the user is authenticated
      if (!author) {
        console.log("Error: User not authenticated");
        return socket.emit("error", { message: "You must be logged in to comment." });
      }

      if (parentId) {
        // Adding a reply to an existing comment
        console.log("Handling reply to parent comment:", parentId);

        const parentComment = await Comment.findById(parentId);
        
        if (!parentComment) {
          console.log("Error: Parent comment not found", parentId);
          return socket.emit('error', { message: 'Parent comment not found' });
        }

        // Create the reply
        const reply = new Comment({
          comment,
          author,
          parentId,
          blogId,
        });

        // Save the reply in the parent comment's replies array
        parentComment.replies.push(reply);
        await parentComment.save();
        
        // Broadcast the reply, including nested structure
        console.log("Reply added successfully:", reply);
        io.emit('commentAdded', { blogId, comment: reply, parentId });
      } else {
        // Adding a new top-level comment
        console.log("Handling new top-level comment for blogId:", blogId);

        const newComment = new Comment({
          blogId,
          author,
          comment,
        });

        await newComment.save();

        console.log("New comment added successfully:", newComment);

        // Broadcast the new top-level comment
        io.emit('commentAdded', { blogId, comment: newComment });
      }
    } catch (error) {
      console.error("Error adding comment/reply:", error);
      socket.emit("error", { message: "Failed to add comment/reply." });
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});



// Test route to ensure server is working
app.get("/test", (req, res) => {
  console.log("Test successful");
  res.send("Test successful");
});

// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
