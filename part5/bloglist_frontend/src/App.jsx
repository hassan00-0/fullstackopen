import { useState, useEffect } from "react";
import { Routes, Route, useMatch, useNavigate, Navigate } from "react-router-dom";
import { Container } from "@mui/material";

import Blog from "./components/Blog";
import BlogList from "./components/BlogList";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import NavBar from "./components/NavBar";
import Notification from "./components/Notification";

import blogService from "./services/blogs.js";
import { login } from "./services/login.js";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState(null);

  const [user, setUser] = useState(() => {
    const loggedUserJson = window.localStorage.getItem("loggedBlogUser");
    if (!loggedUserJson) return null;

    const loggedUser = JSON.parse(loggedUserJson);
    blogService.setToken(loggedUser.token);
    return loggedUser;
  });

  const navigate = useNavigate();

  const notify = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await login({ username, password });
      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));
      blogService.setToken(user.token);

      setUser(user);
      notify(`Logged in as ${user.name}`);
      navigate("/");
    } catch {
      notify("wrong username or password", "error");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogUser");
    blogService.setToken(null);
    setUser(null);
    notify("logged out");
    navigate("/");
  };

  const addNewBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(newBlog));
      notify(`a new blog ${newBlog.title} was created by ${newBlog.author}`);
    } catch {
      notify("failed to add new blog", "error");
    }
  };

  const likeBlog = async (blog) => {
    try {
      const updatedBlog = await blogService.update(blog.id, {
        user: blog.user ? blog.user.id : null,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url,
      });
      setBlogs(blogs.map((b) => (b.id === blog.id ? updatedBlog : b)));
    } catch {
      notify("failed to like blog", "error");
    }
  };

  const removeBlog = async (blog) => {
    try {
      await blogService.remove(blog.id);
      setBlogs(blogs.filter((b) => b.id !== blog.id));
      notify(`removed blog ${blog.title} by ${blog.author}`);
    } catch {
      notify("failed to remove blog", "error");
    }
  };

  const match = useMatch("/blogs/:id");
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null;

  return (
    <Container>
      <NavBar user={user} onLogout={handleLogout} />
      <Notification notification={notification} />

      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blog}
              user={user}
              onLike={likeBlog}
              onRemove={removeBlog}
            />
          }
        />
        <Route
          path="/create"
          element={
            user ? <BlogForm createBlog={addNewBlog} /> : <Navigate replace to="/login" />
          }
        />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/" element={<BlogList blogs={blogs} />} />
      </Routes>
    </Container>
  );
};

export default App;
