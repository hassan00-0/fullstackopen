import globals from "globals";
import stylistic from "@stylistic/eslint-plugin";

export default [
  {
    files: ["**/*.js"],
    ignores: ["dist/**", "node_modules/**"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.node,
      },
      ecmaVersion: "latest",
    },
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      // Stylistic rules (code style)
      "@stylistic/indent": ["error", 2],
      "@stylistic/linebreak-style": ["error", "unix"],
      "@stylistic/quotes": ["error", "single"],
      "@stylistic/semi": ["error", "never"],

      // Common rules (manually added instead of js.configs.recommended)
      "no-unused-vars": "warn",
      "no-undef": "error",
      eqeqeq: "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "no-console": "off",
    },
  },
];
