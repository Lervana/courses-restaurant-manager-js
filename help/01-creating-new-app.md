# 01 - Simple app

To create a new application, follow these steps:

1. Type `yarn init`
2. Enter fields values (name, description etc.).
3. Add `type` field in `package.json`:

```json
{
  "name": "restaurant-manager-js",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "git@github.com:Lervana/restaurant-manager-js.git",
  "author": "Katarzyna Dadek <k.dadek@lervana.dev>",
  "license": "MIT",
  "private": true,
  "type": "module"
}
```

4. Install packages: 
   ```shell
   > yarn add cross-env config`
   > yarn add jest nodemon -D`
   ````
5. Add scripts to run your app by yarn/npm [package.json]:

```json
{
  "name": "restaurant-manager-js",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "git@github.com:Lervana/restaurant-manager-js.git",
  "author": "Katarzyna Dadek <k.dadek@lervana.dev>",
  "license": "MIT",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "cross-env NODE_ENV=development NODE_CONFIG_DIR=config nodemon src/index.js",
    "test": "cross-env NODE_ENV=test NODE_CONFIG_DIR=config jest --detectOpenHandles --maxWorkers=1 --watch"
  },
  "dependencies": {
    "config": "^3.3.6",
    "cross-env": "^7.0.3",
    "jest": "^26.6.3"
  }
}
```

6. Create a index.js file in src directory.

- `mkdir src`
- `touch src/index.js`

7. Add _console.log_ into index.js file:

```js
console.log("test");
```

8. Run app: `yarn dev`. Now nodemon will watch all changes inside src folder and then it will rerun the application when changes will occur.
