import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tailwind from "eslint-plugin-tailwindcss";
import tseslint from "typescript-eslint";
const tailwindRecommended = tailwind.configs["flat/recommended"];
export default tseslint.config(
  { ignores: ["dist", "src/shared/ui/**", "src/features/video/ui/CustomVideo.tsx", "src/pages/DemoView.tsx"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...(tailwindRecommended?.extends ?? []),
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ...tailwindRecommended?.languageOptions,
      ecmaVersion: 2020,
      globals: {
        ...(tailwindRecommended?.languageOptions?.globals ?? {}),
        ...globals.browser,
      },
    },
    plugins: {
      ...(tailwindRecommended?.plugins ?? {}),
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: {
      ...(tailwindRecommended?.settings ?? {}),
    },
    rules: {
      ...(tailwindRecommended?.rules ?? {}),
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  },
  {
    files: ["src/shared/ui/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  {
    files: ["src/shared/config/api.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
    },
  },
  {
    files: ["src/shared/lib/contexts/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
);


