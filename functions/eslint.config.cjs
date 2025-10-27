// functions/eslint.config.cjs
const globals = require("globals");

module.exports = [
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**", "lib/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script", // CommonJS (require/exports/process/module)
      globals: {
        ...globals.node,    // enables require, exports, module, process, __dirname, etc.
      },
    },
    rules: {
      // add project rules if you want
    },
  },
];
