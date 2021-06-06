# 08 - REST to CRUD

1.  Create example routes file: `touch src/routes/example.js`.

2.  Initialize example methods:

    ```js
    // src/routes/example.js

    export const getExample = (req, res) => {
      return res.json({ data: "get example" });
    };

    export const postExample = (req, res) => {
      return res.json({ data: "post example" });
    };

    export const patchExample = (req, res) => {
      return res.json({ data: "patch example" });
    };

    export const deleteExample = (req, res) => {
      return res.json({ data: "delete example" });
    };
    ```

3.  Add those methods to routes index:

    ```js
    // src/routes/index.js

    import { getStatus } from "./status.js";

    import {
      deleteExample,
      getExample,
      getExamples,
      patchExample,
      postExample,
    } from "./example.js";

    export default [
      {
        method: "GET",
        path: "/status",
        isPublic: true,
        cbs: [getStatus],
      },
      {
        method: "GET",
        path: "/example/all",
        cbs: [getExamples],
      },
      {
        method: "GET",
        path: "/example/:id",
        cbs: [getExample],
      },
      {
        method: "POST",
        path: "/example",
        cbs: [postExample],
      },
      {
        method: "PATCH",
        path: "/example",
        cbs: [patchExample],
      },
      {
        method: "DELETE",
        path: "/example/:id",
        cbs: [deleteExample],
      },
    ];
    ```

4.  Create services folder: `mkdir src/services`.

5.  Create example service file: `touch src/services/example.js`.

6.  Initialize example service:

    ```js
    // src/services/example.js

    export const createExample = () => {};
    export const readExample = () => {};
    export const readExamples = () => {};
    export const updateExample = () => {};
    export const deleteExample = () => {};
    ```

7.  Start docker (local app) and run database in one terminal window: `docker-compose up`.

8.  Create file for sequelize setup: `touch src/DatabaseProvider.js`.

9.  Initialize sequelize connection:

    ```js
    // src/DatabaseProvider.js

    import config from "config";
    import { Sequelize } from "sequelize";

    class DatabaseProvider {
      sequelize = null;

      constructor() {
        this.sequelize = new Sequelize(config.database);
      }

      testConnection = async () => {
        try {
          await this.sequelize.authenticate();
          console.log("Connection has been established successfully.");
        } catch (error) {
          console.error("Unable to connect to the database:", error);
          throw error;
        }
      };
    }

    const databaseProvider = new DatabaseProvider();
    export default databaseProvider;
    ```

10. Test database connection before starting app:

    ```js
    // src/index.js

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
    ```

11. Create example migration: `npx sequelize migration:generate --name example`.

12. Rename `/database/migrations/xyz-example.js` to `/database/migrations/xyz-example.cjs`.

13. Add few fields into example migration:

    ```js
    // /database/migrations/xyz-example.cjs

    "use strict";

    module.exports = {
      up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("example", {
          id: Sequelize.INTEGER,
          name: Sequelize.STRING,
          data: Sequelize.STRING,
        });
      },

      down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("example");
      },
    };
    ```

14. Run migrations: `npx sequelize db:migrate`.

15. Create models directory: `mkdir src/models`.

16. Create example model file: `touch src/models/example.js`.

17. Extend DatabaseProvider by define model function and crud functions:

    ```js
    // src/DatabaseProvider.js

    import config from "config";
    import { Sequelize } from "sequelize";

    class DatabaseProvider {
      sequelize = null;
      models = {};

      constructor() {
        this.sequelize = new Sequelize(config.database);
      }

      testConnection = async () => {
        try {
          await this.sequelize.authenticate();
          console.log("Connection has been established successfully.");
        } catch (error) {
          console.error("Unable to connect to the database:", error);
          throw error;
        }
      };

      defineModel = (name, attributes, options) => {
        this.models[name] = this.sequelize.define(name, attributes, options);
        return this.models[name];
      };

      transaction = async (cb) => {
        const t = await this.sequelize.transaction();

        try {
          await cb();
          await t.commit();
        } catch (error) {
          console.error(error);
          await t.rollback();
          throw error;
        }
      };

      getAll = async (modelName) => {
        return await this.models[modelName].findAll();
      };

      getOne = async (modelName, options) => {
        return await this.models[modelName].findOne(options);
      };

      create = async (modelName, options, useTransaction = true) => {
        const action = async () => await this.models[modelName].create(options);
        return useTransaction ? this.transaction(action) : action();
      };

      update = async (
        modelName,
        condition,
        fieldsToUpdate,
        useTransaction = true
      ) => {
        const action = async () => {
          const model = await this.getOne(modelName, condition, false);
          Object.keys(fieldsToUpdate).forEach((key) => {
            model[key] = fieldsToUpdate[key];
          });
          await model.save();
        };
        return useTransaction ? this.transaction(action) : action();
      };

      delete = async (modelName, condition, useTransaction = true) => {
        const action = async () => {
          const model = await this.getOne(modelName, condition, false);
          await model.destroy();
        };
        return useTransaction ? this.transaction(action) : action();
      };
    }

    const databaseProvider = new DatabaseProvider();
    export default databaseProvider;
    ```

18. Implement model:

    ```js
    // src/models/example.js

    import { Sequelize } from "sequelize";
    import databaseProvider from "../DatabaseProvider.js";

    const MODEL_NAME = "example";

    databaseProvider.defineModel(
      MODEL_NAME,
      {
        id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: Sequelize.DataTypes.STRING,
          unique: true,
        },
        data: {
          type: Sequelize.DataTypes.STRING,
        },
      },
      {
        timestamps: false,
      }
    );

    export const getOneExample = async (options) =>
      databaseProvider.getOne(MODEL_NAME, options);

    export const getAllExample = async () =>
      databaseProvider.getAll(MODEL_NAME);

    export const createExample = async (options) =>
      databaseProvider.create(MODEL_NAME, options);

    export const updateExample = async (condition, fieldsToUpdate) =>
      databaseProvider.update(MODEL_NAME, condition, fieldsToUpdate);

    export const deleteExample = async (condition) =>
      databaseProvider.delete(MODEL_NAME, condition);
    ```

19. Install body parser: `yarn add body-parser`.

20. Add body parser to express instance:

    ```js
    // src/Server.js
    // ...
    import bodyParser from "body-parser";
    // ...

    export default class Server {
      //...

      constructor(corsOptions, publicRoutesPrefix, privateRoutesPrefix) {
        this.instance.use(helmet());
        this.instance.use(cors(corsOptions || {}));
        this.instance.use(bodyParser.json());
        this.instance.disable("x-powered-by");

        //...
      }

      //...
    }
    ```

21. Connect services with models:

    ```js
    // src/services/example.js

    import {
      getAllExample,
      getOneExample,
      deleteExample,
      createExample,
      updateExample,
    } from "../models/example.js";

    export const ExampleService = {
      read: async (id) => (await getOneExample({ where: { id } })) || null,
      readAll: async () => (await getAllExample()) || [],
      create: async (id, name, data) =>
        await createExample({
          id,
          name,
          data: typeof data === "string" ? data : JSON.stringify(data),
        }),
      update: async (id, fieldsToUpdate) =>
        await updateExample({ where: { id } }, fieldsToUpdate),
      delete: async (id) => await deleteExample({ where: { id } }),
    };
    ```

22. Connect endpoints with services:

    ```js
    // src/routes/example.js
    
    import { ExampleService } from "../services/example.js";
    
    export const getExample = async (req, res) => {
      const { params } = req;
      if (!params?.id) return res.json({ data: [] });
      return res.json({ data: await ExampleService.read(params.id) });
    };
    
    export const getExamples = async (req, res) => {
      return res.json({ data: await ExampleService.readAll() });
    };
    
    export const postExample = async (req, res) => {
      const { body } = req;
      const { id, name, data } = body || {};
    
      try {
        await ExampleService.create(id, name, data);
        res.status(201);
      } catch (err) {
        res.status(500);
      }
    
      return res.send();
    };
    
    export const patchExample = async (req, res) => {
      const { body } = req;
      const { id, name, data } = body || {};
    
      const fieldsToUpdate = {};
      if (name !== undefined) fieldsToUpdate.name = name;
      if (data !== undefined)
        fieldsToUpdate.data =
          typeof data === "string" ? data : JSON.stringify(data);
    
      try {
        await ExampleService.update(id, fieldsToUpdate);
        res.status(200);
      } catch (err) {
        res.status(500);
      }
    
      return res.send();
    };
    
    export const deleteExample = async (req, res) => {
      const { params } = req;
      const { id } = params || {};
      await ExampleService.delete(id);
      return res.send();
    };
    ```
