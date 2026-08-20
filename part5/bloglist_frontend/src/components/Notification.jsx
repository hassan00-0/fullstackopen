import { Alert } from "@mui/material";

const Notification = ({ notification }) => {
  if (notification === null) return null;

  return (
    <Alert
      severity={notification.type}
      sx={{ marginTop: 2, marginBottom: 2 }}
      className={`notification ${notification.type}`}
    >
      {notification.message}
    </Alert>
  );
};

export default Notification;
