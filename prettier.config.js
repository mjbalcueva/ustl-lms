/** @type {import('prettier').Config & import('@ianvs/prettier-plugin-sort-imports').PluginConfig & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  bracketSameLine: false,
  endOfLine: "lf",
  importOrder: [
    "^(next/(.*)$)|^(next$)|^(react/(.*)$)|^(react$)", // Next.js and React.js modules
    "<BUILTIN_MODULES>", // Node.js built-in modules
    "<THIRD_PARTY_MODULES>", // NPM packages
    "",
    "^@/client/(.*)$",
    "",
    "^@/server/(.*)$",
    "",
    "^@/shared/(.*)$",
    "",
    "^@/trpc/(.*)$",
    "",
    "^@/(.*)$",
    "",
    "^(?!.*[.]css$)[./].*$", // Relative imports
    ".css$", // CSS imports
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  printWidth: 120,
  quoteProps: "consistent",
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "none",
  useTabs: true,
};

export default config;
