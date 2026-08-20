import { useNavigate } from "react-router-dom";
import { Button, Link, Paper, Typography } from "@mui/material";

const Blog = ({ blog, user, onLike, onRemove }) => {
  const navigate = useNavigate();

  if (!blog) return null;

  const canRemove =
    user && blog.user ? blog.user.username === user.username : false;

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await onRemove(blog);
      navigate("/");
    }
  };

  return (
    <Paper className="blog" sx={{ padding: 2, marginTop: 2 }}>
      <Typography variant="h5">
        {blog.title} {blog.author}
      </Typography>

      <Link href={blog.url}>{blog.url}</Link>

      <Typography sx={{ marginTop: 1 }}>
        {blog.likes} likes{" "}
        {user && (
          <Button size="small" variant="outlined" onClick={() => onLike(blog)}>
            like
          </Button>
        )}
      </Typography>

      <Typography sx={{ marginTop: 1 }}>
        added by {blog.user ? blog.user.name : "unknown"}
      </Typography>

      {canRemove && (
        <Button
          size="small"
          variant="contained"
          color="error"
          sx={{ marginTop: 1 }}
          onClick={handleRemove}
        >
          remove
        </Button>
      )}
    </Paper>
  );
};

export default Blog;
