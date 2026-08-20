import { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onLogin({ username, password });
    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <Typography variant="h5" sx={{ marginTop: 2, marginBottom: 1 }}>
        Log in to application
      </Typography>

      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="dense"
          />
        </div>

        <div>
          <TextField
            label="password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="dense"
          />
        </div>

        <Button type="submit" variant="contained" sx={{ marginTop: 1 }}>
          login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
