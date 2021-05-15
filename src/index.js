import config from "config";

import Server from "./Server.js";

const server = new Server(config.cors_options, config.options.port);
server.start(
  config.options.port,
  config.security.key_path,
  config.security.cert_path
);
