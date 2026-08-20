import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography } from "@mui/material";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createBlog({ title, author, url });
    setTitle("");
    setAuthor("");
    setUrl("");
    navigate("/");
  };

  return (
    <div>
      <Typography variant="h5" sx={{ marginTop: 2, marginBottom: 1 }}>
        Create new blog
      </Typography>

      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="dense"
          />
        </div>

        <div>
          <TextField
            label="author"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            margin="dense"
          />
        </div>

        <div>
          <TextField
            label="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            margin="dense"
          />
        </div>

        <Button type="submit" variant="contained" sx={{ marginTop: 1 }}>
          create
        </Button>
      </form>
    </div>
  );
};

export default BlogForm;
