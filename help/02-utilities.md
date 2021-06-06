# 02 - Utilities

To keep the application clean and readable please use below tools:

### NPX

Add _npx_ [https://www.npmjs.com/package/npx]: `npm install -g npx`.

### ESlint

ESlint is a very useful tool - it requires that certain rules are met in the code [https://www.npmjs.com/package/eslint].

- Install eslint: `yarn add eslint -D`
- Type: `npx eslint --init`, pick options:

  | Question                                           | Answer                               |
  | -------------------------------------------------- | ------------------------------------ |
  | How would you like to use ESLint?                  | _To check syntax and find problems_  |
  | What type of modules does your project use?        | _JavaScript modules (import/export)_ |
  | Which framework does your project use?             | _None of these_                      |
  | Does your project use TypeScript?                  | _No_                                 |
  | Where does your code run?                          | _Node_                               |
  | What format do you want your config file to be in? | _JSON_                               |

  This will create .eslintrc.json file.

  ```json
  {
    "env": {
      "node": true,
      "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
      "ecmaVersion": 12,
      "sourceType": "module"
    },
    "rules": {}
  }
  ```

### Prettier

To keep code clean please use _Prettier_ [https://www.npmjs.com/package/prettier]:

- Install prettier: `yarn add prettier -D`.
- Create `.prettierrc` file containing _Prettier_ setup:

  ```json
  {
    "trailingComma": "all",
    "tabWidth": 4,
    "semi": true,
    "singleQuote": true
  }
  ```

- Add _prettier_ support to IDE. For WebStorm go to _Preferences_ > _Languages & Frameworks_ > _JavaScript_ > _Prettier_ and set Node interpreter and prettier package. Please check boxes _on code reformat_ and _on save_. IDE may require restart.

### Prettier integration with ESlint

Prettier need to be connected with ESlint. In that case you need to add eslint-config-prettier: `yarn add eslint-config-prettier -D`. Then change .eslintrc.json file into:

  ```json
  {
    "env": {
      "node": true,
      "es2021": true
    },
    "extends": ["eslint:recommended", "prettier"],
    "parserOptions": {
      "ecmaVersion": 12,
      "sourceType": "module"
    },
    "rules": {}
  }
  ```

### Husky and lint-staged

Husky is helped with making _Prettier_ reformatting code before each commit. It improves code quality even if the developer has no _Prettier_ connected to IDE! _Lint-staged_ allows running linters against staged git files. Combined prevent committing not wanted mistakes.

- Install husky by typing `yarn add husky lint-staged -D`.
- Then run configuration commands
  ```shell
  > yarn add --dev husky lint-staged
  > npx husky install
  > npm set-script prepare "husky install"
  > npx husky add .husky/pre-commit "npx lint-staged"
  ```
- Add the following to your package.json:
  ```json
  {
    "lint-staged": {
      "src/**/*": ["eslint --fix", "prettier --write --ignore-unknown"]
    }
  }
  ```

**WARNING**

When _husky_ is not working because it cannot - for example - find npx please add file `~/.huskyrc` containing this content:

```shell
# ~/.huskyrc
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"`
```

## Shortcut

To keep the application clean and readable please use below tools:

1. Add _npx_ [https://www.npmjs.com/package/npx]: `npm install -g npx`.
2. Install eslint: `yarn add eslint -D`.
3. Initialize eslint config: `npx eslint --init` [_To check syntax and find problems_, _JavaScript modules (import/export)_, _None of these_, _No_, _Node_, _JSON_].
4. Install prettier: `yarn add prettier -D`.
5. Create `.prettierrc` file: `touch .prettierrc`.
6. Add `.prettierrc` content: `echo "{ \"trailingComma\": \"all\", \"tabWidth\": 4, \"semi\": true, \"singleQuote\": true }" >> ./.prettierrc`.
7. Add _prettier_ support to IDE. For WebStorm go to _Preferences_ > _Languages & Frameworks_ > _JavaScript_ > _Prettier_ and set Node interpreter and prettier package. Please check boxes _on code reformat_ and _on save_. IDE may require restart.
8. Add eslint-config-prettier: `yarn add eslint-config-prettier -D`. 
9. In `.eslintrc.json` change "extends" to: ` "extends": ["eslint:recommended", "prettier"]`.
10. Install packages by typing `yarn add husky lint-staged -D`. 
11. Install husky: `npx husky install`.
12. Set scripts: `npm set-script prepare "husky install"`. 
13. Add hooks: `npx husky add .husky/pre-commit "npx lint-staged"`.
14. Add _lint-staged_ config in _package.json_ by adding: `{ "lint-staged": { "src/**/*": ["eslint --fix", "prettier --write --ignore-unknown"] } }`. 
