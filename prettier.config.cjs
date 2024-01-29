// @ts-check

/** @type {import("prettier").Config} */
module.exports = {
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 100,
  arrowParens: "always",
  bracketSpacing: true,
  jsxSingleQuote: true,
  semi: true,

  plugins: [
    require.resolve("@ianvs/prettier-plugin-sort-imports"),
    require.resolve("prettier-plugin-tailwindcss"),
  ],
  tailwindConfig: "./tailwind.config.ts",
  tailwindFunctions: ["clsx", "cn", "cva"],

  importOrder: ["<THIRD_PARTY_MODULES>", "", "^@/(.*)$", "", "^[./]"],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.0.0",
};
