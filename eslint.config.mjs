import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  ...compat.extends('next/core-web-vitals', 'prettier'),
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser
      },

      ecmaVersion: 11,
      sourceType: 'module',

      parserOptions: {
        project: './tsconfig.json',

        ecmaFeatures: {
          jsx: true,
          modules: true,
          experimentalObjectRestSpread: true
        }
      }
    },

    rules: {
      'no-unused-vars': 'error',
      'react/react-in-jsx-scope': 'off',

      'react/jsx-filename-extension': [
        2,
        {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      ],

      'react/display-name': 'off',
      '@next/next/no-img-element': 'off',
      'react/no-unescaped-entities': 'off',
      'import/no-anonymous-default-export': 'off',

      'lines-around-comment': [
        'error',
        {
          beforeLineComment: true,
          beforeBlockComment: true,
          allowBlockStart: true,
          allowClassStart: true,
          allowObjectStart: true,
          allowArrayStart: true
        }
      ],

      'newline-before-return': 'error',

      'import/newline-after-import': [
        'error',
        {
          count: 1
        }
      ],

      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: ['export'],
          next: ['*']
        },
        {
          blankLine: 'always',
          prev: ['*'],
          next: ['multiline-const', 'multiline-let', 'multiline-var', 'export']
        }
      ]
    }
  }
]
