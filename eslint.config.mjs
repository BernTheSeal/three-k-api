import boundaries from "eslint-plugin-boundaries";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["src/**/*.ts"],
    languageOptions: { parser: tseslint.parser },
    plugins: { boundaries },
    settings: {
      "import/resolver": { typescript: { project: "./tsconfig.json" } },
      "boundaries/elements": [
        { type: "module", pattern: "src/modules/*", mode: "folder", capture: ["name"] },
        { type: "shared", pattern: "src/shared", mode: "folder" },
      ],
    },
    rules: {
      "boundaries/entry-point": [
        "error",
        {
          default: "allow",
          rules: [{ target: "module", allow: "index.ts" }],
        },
      ],
      "boundaries/element-types": [
        "error",
        {
          default: "allow",
          rules: [{ from: "shared", disallow: ["module"] }],
        },
      ],
    },
  },
];
