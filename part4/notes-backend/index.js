import app from "./app.js";
import config from "./controllers/utils/config.js";
import logger from "./controllers/utils/logger.js";

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
