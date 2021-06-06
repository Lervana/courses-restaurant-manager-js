import config from "config";
import databaseProvider from "./DatabaseProvider.js";

import Server from "./Server.js";
import routes from "./routes/index.js";

const run = async () => {
  try {
    await databaseProvider.testConnection();

    const server = new Server(
      config.cors_options,
      config.options.public_routes_prefix,
      config.options.private_routes_prefix
    );

    server.addRoutes(routes);
    server.start(
      config.options.port,
      config.security.key_path,
      config.security.cert_path
    );

    server.addRoutes();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
