# 07 - Tests

1. Install testing package: `yarn add jest -D`.

2. Add test script into package.json and config for jest:

   ```json
   {
     "scripts": {
       "dev": "cross-env NODE_ENV=development nodemon src/index.js",
       "test-api": "cross-env NODE_ENV=test nodemon src/index.js",
       "tests": "cross-env NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules jest --detectOpenHandles --maxWorkers=1 --watch",
       "prepare": "husky install",
       "lint": "eslint src"
     },
     "jest": {
       "transform": {}
     }
   }
   ```

3. Create folder for tests: `mkdir tests`.
4. Create routes tests folder: `mkdir tests/routes`.
5. Create status tests file: `touch tests/routes/status.test.js`.
6. Add axios: `yarn add axios -D`.
7. Add helpers file: `touch tests/helpers.js`:

   ```js
   // tests/helpers.js

   import axios from "axios";
   import https from "https";
   import config from "config";

   const agent = new https.Agent({
     rejectUnauthorized: false,
   });

   export const getAppUrl = (uri, isPublic, env) => {
     switch (env) {
       //TODO add other envs
       default:
         return `https://localhost:${config.options.port}${
           isPublic
             ? config.options.public_routes_prefix
             : config.options.private_routes_prefix
         }${uri}`;
     }
   };

   export const callApi = async (method, uri, body, options, isPublic, env) => {
     const url = getAppUrl(uri, isPublic, env);
     const conf = { ...options, httpsAgent: agent };
     switch (method) {
       case "post":
         return axios.post(url, body, conf);
       case "put":
         return axios.put(url, body, conf);
       case "patch":
         return axios.patch(url, body, conf);
       case "delete":
         return axios.delete(url, conf);
       default:
         return await axios.get(url, conf);
     }
   };
   ```

8. Add test config file: `touch config/test.cjs`:

   ```js
   // config/test.cjs

   module.exports = {
     is_test: true,
     name: "restaurant-manager-js-test",
     options: {
       port: 3001,
     },
   };
   ```

9. In one terminal run `yarn test-api` and in second `yarn test`.

10. Write status test in _tests/routes/status.test.js_:

   ```js
   // tests/routes/status.test.js
   
   import { callApi } from "../helpers.js";
   
   const PATH = `api/public/status`;
   
   test(`[GET] ${PATH} - valid request - should return status 200`, async () => {
     const response = await callApi("get", "/status", {}, {}, true);
     expect(response.status).toEqual(200);
     expect(response.data?.status).toEqual("OK");
   });
   ```
