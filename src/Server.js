import cors from "cors";
import express from "express";
import helmet from "helmet";
import https from "https";
import fs from "fs";
import util from "util";
import limit from "express-rate-limit";

const readFile = util.promisify(fs.readFile);

export default class Server {
  instance = express();

  constructor(corsOptions, publicRoutesPrefix) {
    this.instance.use(helmet());
    this.instance.use(cors(corsOptions || {}));
    this.instance.disable("x-powered-by");
    if (publicRoutesPrefix)
      this.instance.use(
        publicRoutesPrefix,
        limit({ windowMs: 15 * 60 * 1000, max: 250 })
      );
  }

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
