# 04 - Migrations

1. Install **Sequelize Command Line Interface (CLI)** [https://github.com/sequelize/cli]:

- Install Sequelize: `yarn add sequelize` [https://www.npmjs.com/package/sequelize].
- Install Sequelize CLI: `yarn add sequelize-cli -D` [https://www.npmjs.com/package/sequelize-cli].
- Install mysql2: `yarn add mysql2` [https://www.npmjs.com/package/mysql2].
- Run `npx sequelize --help` to see all available commands.

2. Prepare configuration using **config** package.

- Create _config_ directory: `mkdir config`.
- Create _default_ config file: `touch config/default.cjs`. ".cjs" is needed because config is not supporting
  ESM modules.
- Create _utils_ file: `touch config/utils.cjs`.
- Create _database_ config file: `touch database/dbConfig.cjs`.

3. Create **.env** file.

- Remember that this file shouldn't be committed! This file should contain all values that allows to connect to database. If you are using docker-compose.yaml you need to put the same value as there for each env variable.

```shell
### DATABASE ###
DB_USERNAME=exampleuser
DB_PASSWORD=examplepass
DB_HOST=localhost
DB_NAME=exampledb
DB_PORT=3307
DB_DIALECT=mysql
```

4. Use **dotenv** to read environment variables

- Install _dotenv_ package: `yarn add dotenv` [https://www.npmjs.com/package/dotenv].
- Install _lodash_ package: `yarn add lodash` [https://www.npmjs.com/package/lodash].
- Handle reading variables inside config/utils.cjs file:

```js
// config/utils.cjs

const _ = require("lodash");
const noEnvFile = process.env.NO_ENVFILE;
if (_.isNil(noEnvFile)) require("dotenv").config();
module.exports.nodeEnv = process.env.NODE_ENV;
```

5. Create **_database_** config. Part `require("./utils")` is very important. If we want to use Sequelize CLI, this part will allow reading envs.

```js
// database/dbConfig.cjs

require("../config/utils.cjs");

module.exports = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  native: true,
};
```

6. Create **default** config for all environments

```js
// config/default.cjs
const { nodeEnv } = require("./utils");
const { databaseConfig } = require("../database/dbConfig");

module.exports = {
  env: nodeEnv,
  is_test: false,
  name: "restaurant-manager-js",
  database: databaseConfig,
};
```

7. Create **.sequelizerc** containing Sequelize setup: `touch .sequelizerc`.

```js
const path = require("path");

module.exports = {
  config: path.resolve("database", "dbConfig.cjs"),
  "models-path": path.resolve("src", "models"),
  "seeders-path": path.resolve("database", "seeders"),
  "migrations-path": path.resolve("database", "migrations"),
};
```

8. Make initialization:

```shell
> sequelize init:migrations
> sequelize init:seeders
```

9. Create test migration:

```shell
> sequelize migration:generate --name test
```

10. Rename file `database/migrations/20210508220145-test.js` to `database/migrations/20210508220145-test.cjs`

10. Implement test migration:
```js
// database/migrations/20210508220145-test.cjs

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("test", { id: Sequelize.INTEGER });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("test");
  },
};
```

11. Run test migration: `npx sequelize db:migrate`.

11. Undo test migration: `npx sequelize db:migrate:undo`.
