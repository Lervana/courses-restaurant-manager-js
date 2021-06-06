import cors from "cors";
import express from "express";
import helmet from "helmet";
import https from "https";
import fs from "fs";
import util from "util";
import limit from "express-rate-limit";
import bodyParser from "body-parser";

const readFile = util.promisify(fs.readFile);

export default class Server {
  instance = express();
  publicRoutesPrefix = "";
  privateRoutesPrefix = "";

  constructor(corsOptions, publicRoutesPrefix, privateRoutesPrefix) {
    this.instance.use(helmet());
    this.instance.use(cors(corsOptions || {}));
    this.instance.use(bodyParser.json());
    this.instance.disable("x-powered-by");

    if (publicRoutesPrefix)
      this.instance.use(
        publicRoutesPrefix,
        limit({ windowMs: 15 * 60 * 1000, max: 250 })
      );

    this.publicRoutesPrefix = publicRoutesPrefix;
    this.privateRoutesPrefix = privateRoutesPrefix;
  }

  addRoute = ({ method, path, isPublic, cbs }) => {
    if (!path || !cbs || cbs.length === 0)
      throw new Error("Route need to have defined method, path and callbacks");

    const prefixedPath = `${
      isPublic ? this.publicRoutesPrefix : this.privateRoutesPrefix
    }${path}`;

    console.log(`\tAdding route [${method}] ${prefixedPath}`);
    this.instance[(method || "get").toLowerCase()](prefixedPath, cbs);
    console.log(`\tAdded route [${method}] ${prefixedPath}`);
  };

  addRoutes = (routes) => {
    console.log(
      `Adding ${routes?.length || 0} route${routes?.length === 1 ? "" : "s"}...`
    );
    return routes && routes.forEach((route) => this.addRoute(route));
  };

  start = async (port, keyPath, certPath) => {
    console.log(`Starting server on port ${port}...`);

    const [key, cert] = await Promise.all([
      readFile(keyPath),
      readFile(certPath),
    ]);

    if (key && cert) {
      https
        .createServer({ key, cert }, this.instance)
        .listen(port, () => console.log("HTTPS server UP"));
    } else {
      console.error("Cannot start server, key or cert not found.");
    }
  };
}
