import typescriptParser from "@typescript-eslint/parser";
import pluginVitest from "@vitest/eslint-plugin";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import { globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import pluginPlaywright from "eslint-plugin-playwright";
import pluginVue from "eslint-plugin-vue";

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },

  globalIgnores(["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]),

  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ["src/**/__tests__/*"],
  },

  {
    ...pluginPlaywright.configs["flat/recommended"],
    files: ["e2e/**/*.{test,spec}.{js,ts,jsx,tsx}"],
  },

  {
    name: "app/import-rules",
    files: ["**/*.{ts,mts,tsx,vue}"],
    plugins: {
      import: importPlugin,
    },
    rules: {
      // 引用顺序规则
      "import/order": [
        "error",
        {
          // 分组：外部库 -> 内部模块 -> 相对路径
          groups: [
            "builtin", // Node.js 内置模块
            "external", // 外部依赖
            "internal", // 内部模块
            "parent", // 父目录相对路径
            "sibling", // 同级相对路径
            "index", // 当前目录 index
            "object", // 对象属性
            "type", // 类型导入
          ],
          // 每个组内的字母顺序
          "alphabetize": {
            order: "asc",
            caseInsensitive: true,
          },
          // 不同组之间换行
          "newlines-between": "always",
          // 禁止重复路径
          "pathGroupsExcludedImportTypes": ["builtin"],
          // 自定义路径组
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@shared/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@features/**",
              group: "internal",
              position: "after",
            },
          ],
        },
      ],
      // 禁止重复的导入
      "import/no-duplicates": "error",
    },
  },

  skipFormatting
);
