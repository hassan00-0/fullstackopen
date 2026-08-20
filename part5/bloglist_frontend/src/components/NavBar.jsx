import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const linkStyle = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };

const NavBar = ({ user, onLogout }) => (
  <AppBar position="static">
    <Toolbar>
      <Button color="inherit" component={Link} to="/" sx={linkStyle}>
        blogs
      </Button>

      {user && (
        <Button color="inherit" component={Link} to="/create" sx={linkStyle}>
          create new
        </Button>
      )}

      <Typography sx={{ flexGrow: 1 }} />

      {user ? (
        <>
          <Typography sx={{ marginRight: 2 }}>{user.name} logged in</Typography>
          <Button color="inherit" onClick={onLogout} sx={linkStyle}>
            logout
          </Button>
        </>
      ) : (
        <Button color="inherit" component={Link} to="/login" sx={linkStyle}>
          login
        </Button>
      )}
    </Toolbar>
  </AppBar>
);

export default NavBar;
