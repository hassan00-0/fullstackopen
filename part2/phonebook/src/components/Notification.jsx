const Notification = ({ message, type = "info" }) => {
  if (message === null || message === undefined) {
    return null;
  }

  const styles = {
    color: type === "error" ? "red" : type === "success" ? "green" : "blue",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  return <div style={styles}>{message}</div>;
};

export default Notification;
