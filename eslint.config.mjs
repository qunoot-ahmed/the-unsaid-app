import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Project writing rule: project-authored strings and JSX text must not contain
// em dashes, en dashes or other long dashes. Text entered by users is never in source code.
const forbiddenDashes = `[${[0x2013, 0x2014, 0x2015, 0x2e3a, 0x2e3b, 0xfe58].map((c) => String.fromCodePoint(c)).join("")}]`;
const writingRuleMessage =
  "Project-authored text must not contain em dashes or en dashes. Use a comma, colon, period or parentheses.";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        { selector: `Literal[value=/${forbiddenDashes}/]`, message: writingRuleMessage },
        {
          selector: `TemplateElement[value.raw=/${forbiddenDashes}/]`,
          message: writingRuleMessage,
        },
        { selector: `JSXText[value=/${forbiddenDashes}/]`, message: writingRuleMessage },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "next-env.d.ts",
    "src/generated/**",
    "coverage/**",
    "reports/**",
    "test-results/**",
    "playwright-report/**",
  ]),
]);
