module.exports = {
  parser: '@typescript-eslint/parser',  // Specifies the ESLint parser
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
    "import/newline-after-import": ["error", { "count": 2 }],
    "import/no-named-as-default": 0,
    "max-len": ["warn", { "code": 100 }],
    semi: ["warn", "always"],
    "semi-style": ["error", "last"],
    "arrow-parens": ["error", "always"],
    "arrow-body-style": ["error", "as-needed"],
    "no-var": "error",
    "prefer-const": "error",
    'no-console': 'warn',
    "object-shorthand": "error",
    "quotes": ["error", "single"],
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
