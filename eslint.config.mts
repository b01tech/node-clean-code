import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,ts,mjs,cjs,mts,cts}"],
    ignores: ["node_modules/**", "dist/**"],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.node,
        ...globals.es2025,
      },
    },

    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },

    rules: {
      ...js.configs.recommended.rules,
      semi: ["error", "always"],
      "@typescript-eslint/no-unused-vars": ["warn"],
    },
  },
  ...tseslint.configs.recommended,
]);
