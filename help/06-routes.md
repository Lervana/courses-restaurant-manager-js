# 06 - Routes

1. Add routes directory: `mkdir src/routes`.

2. Add private routes prefix and store prefixes in class fields (Server.js):

   ```js
   // src/Server.js

   export default class Server {
     instance = express();
     publicRoutesPrefix = "";
     privateRoutesPrefix = "";

     constructor(corsOptions, publicRoutesPrefix, privateRoutesPrefix) {
       this.instance.use(helmet());
       this.instance.use(cors(corsOptions || {}));
       this.instance.disable("x-powered-by");

       if (publicRoutesPrefix)
         this.instance.use(
           publicRoutesPrefix,
           limit({ windowMs: 15 * 60 * 1000, max: 250 })
         );

       this.publicRoutesPrefix = publicRoutesPrefix;
       this.privateRoutesPrefix = privateRoutesPrefix;
     }

     // ...
   }
   ```

3. Add method in Server.js that allows adding routes:

   ```js
   // src/Server.js
   // ...

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
       `Adding ${routes?.length || 0} route${
         routes?.length === 1 ? "" : "s"
       }...`
     );
     return routes && routes.forEach((route) => this.addRoute(route));
   };
   ```

4. Implement status route:

   - Create file: `touch src/routes/status.js`.
   - Add route content:

     ```js
     // src/routes/status.js

     export const getStatus = (req, res) => {
       res.json({ status: "OK", datetime: new Date() });
     };
     ```

   - Add file: `touch src/routes/index.js`
   - Define there routes:

     ```js
     // src/routes/index.js
     import { getStatus } from "./status.js";

     export default [
       {
         method: "GET",
         path: "/status",
         isPublic: true,
         cbs: [getStatus],
       },
     ];
     ```

5. Update config:

   ```js
   // config/default.cjs

   const { nodeEnv } = require("./utils.cjs");
   const databaseConfig = require("../database/dbConfig.cjs");

   module.exports = {
     env: nodeEnv,
     is_test: false,
     name: "restaurant-manager-js",
     database: databaseConfig,
     options: {
       port: process.env.PORT,
       public_routes_prefix: "/api/public",
       private_routes_prefix: "/api/private",
     },
     security: {
       key_path: process.env.HTTPS_KEY_PATH,
       cert_path: process.env.HTTPS_CERT_PATH,
     },
   };
   ```

6. Register routes in server:

   ```js
   // src/index.js

   import config from "config";
   import Server from "./Server.js";
   import routes from "./routes/index.js";

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
   ```

7. Test route `https://localhost:3000/api/public/status` in postman.

## Routes shortcut

1. Add routes directory: `mkdir src/routes`.
2. Add private routes prefix and store prefixes in class fields (Server.js): _publicRoutesPrefix_ and _privateRoutesPrefix_.
3. Add method in Server.js that allows adding routes: _addRoutes = (routes) => {}_.
4. Create file: `touch src/routes/status.js` and implement there status route _export const getStatus = (req, res) => {};_.
5. Add file: `touch src/routes/index.js` and define there routes _export default [{ ... }];_.
5. Update config to define prefixes.
6. Register routes in server: _server.addRoutes(routes);_.
7. Test route `https://localhost:3000/api/public/status` in postman.
