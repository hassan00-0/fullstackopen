import { after, beforeEach, test } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { initialBlogs } from "./test_helper.js";
import Blog from "../models/blog.js";
import app from "../app.js";
import supertest from "supertest";

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("correct number of blogs are returned", async () => {
  const res = await api.get("/api/blogs");
  assert.strictEqual(res.body.length, initialBlogs.length);
});

test("blogs have an id property", async () => {
  const response = await api.get("/api/blogs");
  const firstBlog = response.body[0];
  assert(firstBlog.id);
  assert(!firstBlog._id);
});

test("posting a new blog works", async () => {
  const blogsBefore = await Blog.find({});

  const newBlog = {
    title: "Your Test Blog Title",
    author: "Test Author",
    url: "https://test-url.com",
    likes: 5,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAfter = await Blog.find({});
  assert.strictEqual(blogsAfter.length, blogsBefore.length + 1);

  const titles = blogsAfter.map((blog) => blog.title);
  assert(titles.includes("Your Test Blog Title"));
});

test("blog without likes defaults to 0", async () => {
  const newBlog = {
    title: "Blog without likes",
    author: "Test Author",
    url: "https://test-url.com",
  };

  const response = await api.post("/api/blogs").send(newBlog).expect(201);

  assert.strictEqual(response.body.likes, 0);

  const savedBlog = await Blog.findById(response.body.id);
  assert.strictEqual(savedBlog.likes, 0);
});

test("blog without title returns 400", async () => {
  const newBlog = {
    author: "Test Author",
    url: "https://test-url.com",
    likes: 5,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

test("blogs can be deleted", async () => {
  const blogsBefore = await Blog.find({});
  const blogToDelete = blogsBefore[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAfter = await Blog.find({});
  assert.strictEqual(blogsAfter.length, blogsBefore.length - 1);

  const deletedBlog = await Blog.findById(blogToDelete.id);
  assert.strictEqual(deletedBlog, null);
});
after(async () => {
  await mongoose.connection.close();
});
