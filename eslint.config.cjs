const { defineConfig } = require("@eslint/config-helpers");

module.exports = defineConfig({
  plugins: [
    'react',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true
      }
    },
    globals: {
      browser: true,
      node: true,
      es6: true
    }
  },
  rules: {
    "react/react-in-jsx-scope": "off"
  },
  settings: {
    react: {
      version: "detect"
    }
  }
});
