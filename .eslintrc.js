module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "standard-with-typescript",
        "plugin:react/recommended",
        "next/core-web-vitals"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "extends": ['plugin:@typescript-eslint/disable-type-checked'],
            "files": [
                "./**/*.js"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
      semi: ["error", "never"],
      "comma-dangle": ["error", "only-multiline"],
      "space-before-function-paren": ["error", {
          "anonymous": "always",
          "named": "never",
          "asyncArrow": "always"
      }],
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      camelcase: 'off',

      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/space-before-function-paren": ["error", {
          "anonymous": "always",
          "named": "never",
          "asyncArrow": "always"
      }],
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/triple-slash-reference': 'off'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
}
