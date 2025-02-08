import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const API_URL = "https://blog-posting-app-s9ff.vercel.app/";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to render the main page
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    console.log(response.data);
    res.render("index.ejs", { posts: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Route to render the edit page
app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});

app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
    console.log(response.data);
    res.render("modify.ejs", {
      heading: "Edit Post",
      submit: "Update Post",
      post: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

// Create a new post
app.post("/api/posts", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, req.body);
    console.log(response.data);
    res.json(response.data); // Instead of res.redirect("/")
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});

// Partially update a post
app.post("/api/posts/:id", async (req, res) => {
  console.log("called");
  try {
    const response = await axios.patch(
      `${API_URL}/posts/${req.params.id}`,
      req.body
    );
    console.log(response.data);
    res.json(response.data); // Instead of res.redirect("/")
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});

// Delete a post
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/posts/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

// Export for Vercel (Remove app.listen)
export default app;
