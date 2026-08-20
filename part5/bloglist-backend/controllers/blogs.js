import express from "express";
import Blog from "../models/blog.js";
import middleware from "./utils/middleware.js";

const blogsRouter = express.Router();

blogsRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", middleware.userExtractor, async (req, res, next) => {
  try {
    const user = req.user;

    const blog = new Blog({
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      likes: req.body.likes || 0,
      user: user ? user._id : null,
    });

    const savedBlog = await blog.save();

    if (user) {
      user.blogs = user.blogs.concat(savedBlog._id);
      await user.save();
    }

    await savedBlog.populate("user", { username: 1, name: 1 });

    res.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", middleware.userExtractor, async (req, res, next) => {
  try {
    const user = req.user;

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "blog not found" });
    }

    if (user && blog.user && blog.user.toString() !== user._id.toString()) {
      return res
        .status(401)
        .json({ error: "only the user that created the blog can delete it" });
    }

    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ error: "blog not found" });
    }
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", middleware.userExtractor, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, author, url, likes, user: blogUser } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "blog not found" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, author, url, likes, user: blogUser },
      { new: true, runValidators: true },
    ).populate("user", { username: 1, name: 1 });

    res.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;
