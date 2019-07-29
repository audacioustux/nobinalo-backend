module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    "airbnb-base",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  plugins: ["@typescript-eslint"],
  parserOptions: {
    "project": "./tsconfig.json"
  },
  rules: {
    "no-dupe-keys": "error",
    "import/newline-after-import": ["error", { "count": 2 }],
    "import/no-named-as-default": 0,
    "object-curly-spacing": ["error", "always"],
    "max-len": ["warn", { "code": 100 }],
    "semi": "off",
    "@typescript-eslint/semi": 2,
    "semi-style": ["error", "last"],
    "semi-spacing": ["error", { "before": false, "after": true }],
    "arrow-parens": ["error", "always"],
    "arrow-body-style": ["error", "as-needed"],
    "no-var": "error",
    "prefer-const": "error",
    'no-console': 'warn',
    "object-shorthand": "error",
    "quotes": ["error", "single"],
    "eol-last": 1,
    "@typescript-eslint/no-explicit-any": 0,
    "no-multiple-empty-lines": ["error", { "max": 2, "maxBOF": 0, "maxEOF": 0 }],
    'prefer-destructuring': [
      'error', {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: true,
          object: true,
        },
      }, {
        enforceForRenamedProperties: false,
      }
    ],
  }
}
