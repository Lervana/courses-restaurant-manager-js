# 05 - Server

Server will be build on Express.js [https://www.npmjs.com/package/express]

1. Create a file for implementing express server: `touch src/Server.js`.

   ```js
   // src/Server.js

   export default class Server {}
   ```

2. Add instance field - this will be an express representation.

   ```js
   // src/Server.js

   export default class Server {
     instance = undefined;
   }
   ```

3. Install some useful middlewares:

   - helmet [https://www.npmjs.com/package/helmet]
   - express-rate-limit [https://www.npmjs.com/package/express-rate-limit]
   - cors [https://www.npmjs.com/package/cors]

   ```shell
    > yarn add helmet express-rate-limit cors
   ```

4. Add cors config inside _development_ config:

   - Create development config file: `touch config/development.cjs`.
   - Put there development configuration:

   ```js
   module.exports = {
     is_dev: true,
     name: "restaurant-manager-js-dev",
     cors_options: {
       origin: "localhost",
       optionsSuccessStatus: 200,
     },
   };
   ```

5. Initialize express instance:

   - Add express package: `yarn add express`.

   ```js
   // src/Server.js

   import express from "express";

   export default class Server {
     instance = express();
   }
   ```

6. Add middlewares using constructor:

   ```js
   // src/Server.js

   import cors from "cors";
   import express from "express";
   import helmet from "helmet";
   import limit from "express-rate-limit";

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
   }
   ```

7. Create a certificate and key files (in this project HTTPS will be used):

   - Create security dir: `mkdir _security`.
   - Add \_security folder to ignored by git.

   ```shell
   # .gitignore

   node_modules
   .idea
   .env
   _security
   ```

   - Check OpenSSL version: `openssl version`.
   - If there is a need install `brew install openssl` or update OpenSSL `brew upgrade openssl`.
   - Generate private key and certificate (leave "challenge password" blank):

   ```shell
   > openssl genrsa -out _security/key.pem
   > openssl req -new -key _security/key.pem -out _security/csr.pem
   > openssl x509 -req -days 9999 -in _security/csr.pem -signkey _security/key.pem -out _security/cert.pem
   > rm _security/csr.pem
   ```

8. Create server start method:

   - Add packages _https_, _utils_, _fs_ - they don't need to be installed.
   - Add promisified readFile method: `const readFile = util.promisify(fs.readFile);`.

   ```js
   //src/Server.js

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
   ```

9. Extend ".env" file by three options:

   ```shell
    // .env

   ### DATABASE ###
   DB_USERNAME=exampleuser
   DB_PASSWORD=examplepass
   DB_HOST=localhost
   DB_NAME=exampledb
   DB_PORT=3307
   DB_DIALECT=mysql

   ### OPTIONS ###
   PORT=3000
   HTTPS_KEY_PATH=_security/key.pem
   HTTPS_CERT_PATH=_security/cert.pem
   ```

10. Add options in config:

   ```js
   // config/default.cjs
   
   const { nodeEnv } = require("./utils");
   const { databaseConfig } = require("../database/dbConfig");
   
   module.exports = {
     env: nodeEnv,
     is_test: false,
     name: "restaurant-manager-js",
     database: databaseConfig,
     options: {
       port: process.env.PORT,
       public_routes_prefix: "/api/public",
     },
   };
   ```

11. Make sure that scripts in package.json looks like:

   ```json
   {
     "scripts": {
       "dev": "cross-env NODE_ENV=development nodemon src/index.js",
       "test": "cross-env NODE_ENV=test jest --detectOpenHandles --maxWorkers=1 --watch",
       "prepare": "husky install",
       "lint": "eslint src"
     }
   }
   ```

12. Also make sure that in your config you require modules with .cjs extension.

   ```js
   // config/default.cjs
   
   {
     const { nodeEnv } = require("./utils.cjs");
     const databaseConfig = require("../database/dbConfig.cjs");
     // ...
   }
   ```

13. Import and start Server in index.js.

- Import config package: `import config from 'config';`
- Create server instance: `const server = new Server(config.cors_options, config.options.port);`.
- Start server: `server.start(config.options.port, config.security.key_path, config.security.cert_path);`

  ```js
  // src/index.js

  import config from "config";

  import Server from "./Server.js";

  const server = new Server(config.cors_options, config.options.port);
  server.start(
    config.options.port,
    config.security.key_path,
    config.security.cert_path
  );
  ```

14. Add babel-eslint: `yarn add babel-eslint -D`.

15. Update .eslintrc.json:
    ```json
    {
      "env": {
        "node": true,
        "es2021": true
      },
      "parser": "babel-eslint",
      "extends": ["eslint:recommended", "prettier"],
      "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
      },
      "rules": {}
    }
    ```

## Server shortcut

1. Create a file for implementing express server: `touch src/Server.js`.
2. Create server class and add instance field - this will be an express representation.
3. Install some useful middlewares: `yarn add helmet express-rate-limit cors`.
4. Create development config file: `touch config/development.cjs` and put there development configuration.
5. Add express package: `yarn add express` and initialize express instance `instance = express()`.
6. Add cors, helmet and limiter middlewares.
7. Create a certificate and key files (in this project HTTPS will be used).
8. Create server start method.
9. Extend ".env" file by three options: PORT, HTTPS_KEY_PATH and HTTPS_CERT_PATH.
10. Add extended env options in config.
11. Make sure that in your config you require modules with .cjs extension.
12. Import and start Server in index.js.
13. Add babel-eslint: `yarn add babel-eslint -D`.
14. Update .eslintrc.json.
