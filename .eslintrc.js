module.exports = {
    root: true,

    parser: 'babel-eslint',

    plugins: ['import', 'react'],

    env: {
      browser: true,
      commonjs: true,
      es6: true,
      jest: true,
      node: true
    },

    parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
        generators: true,
        experimentalObjectRestSpread: true
      }
    },

    settings: {
      'import/ignore': [
        'node_modules'
      ],
      'import/extensions': ['.js'],
      'import/resolver': {
        node: {
          extensions: ['.js', '.json']
        }
      }
    },

    rules: {
      // http://eslint.org/docs/rules/
      'one-var': ['warn', 'never'],
      'space-before-blocks': "error",
      'arrow-spacing': "error",
      'arrow-parens': [2, "as-needed", { "requireForBlockBody": true }],
      'keyword-spacing': ['error', {'before': true, 'after': true}],
      'array-callback-return': 'warn',
      'array-bracket-spacing': ['warn', 'never'],
      'dot-location': ['warn', 'property'],
      'guard-for-in': 'warn',
      'new-parens': 'error',
      'no-else-return': 'error',
      'no-array-constructor': 'error',
      'no-caller': 'warn',
      'no-cond-assign': ['warn', 'always'],
      'no-const-assign': 'error',
      'no-delete-var': 'error',
      'no-dupe-args': 'error',
      'no-dupe-class-members': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty-character-class': 'error',
      'no-empty-pattern': 'error',
      'no-eval': 'error',
      'no-ex-assign': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-label': 'error',
      'no-extra-semi': 'error',
      'no-fallthrough': 'error',
      'no-func-assign': 'error',
      'no-implied-eval': 'error',
      'no-invalid-regexp': 'error',
      'no-iterator': 'warn',
      'no-label-var': 'warn',
      'no-labels': ['warn', { allowLoop: false, allowSwitch: false }],
      'no-lone-blocks': 'warn',
      'no-loop-func': 'warn',
      'no-mixed-operators': ['warn', {
        groups: [
          ['&', '|', '^', '~', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
          ['&&', '||'],
          ['in', 'instanceof']
        ],
        allowSamePrecedence: false
      }],
      'no-multi-str': 'warn',
      'no-native-reassign': 'warn',
      'no-negated-in-lhs': 'warn',
      'no-new-func': 'error',
      'no-new-object': 'error',
      'no-new-symbol': 'error',
      'no-new-wrappers': 'error',
      'no-obj-calls': 'warn',
      'no-octal': 'warn',
      'no-octal-escape': 'warn',
      'no-redeclare': 'error',
      'no-regex-spaces': 'error',
      'no-restricted-syntax': [
        'warn',
        'LabeledStatement',
        'WithStatement',
      ],
      'no-script-url': 'warn',
      'no-self-assign': 'error',
      'no-self-compare': 'warn',
      'no-sequences': 'warn',
      'no-shadow-restricted-names': 'warn',
      'no-sparse-arrays': 'warn',
      'no-template-curly-in-string': 'warn',
      'no-this-before-super': 'warn',
      'no-throw-literal': 'warn',
      'no-undef': 'error',
      'no-unexpected-multiline': 'error',
      'no-unreachable': 'warn',
      'no-unused-expressions': ['error', {
        'allowShortCircuit': true,
        'allowTernary': true
      }],
      'no-unused-labels': 'error',
      'no-unused-vars': ['error', {
        vars: 'local',
        args: 'none'
      }],
      'no-use-before-define': ['warn', 'nofunc'],
      'no-useless-computed-key': 'error',
      'no-useless-concat': 'error',
      'no-useless-constructor': 'warn',
      'no-useless-escape': 'warn',
      'no-useless-rename': ['warn', {
        ignoreDestructuring: false,
        ignoreImport: false,
        ignoreExport: false,
      }],
      'no-with': 'error',
      'no-whitespace-before-property': 'error',
      'radix': 'error',
      'require-yield': 'error',
      'rest-spread-spacing': ['warn', 'never'],
      'strict': ['warn', 'never'],
      'semi': ['warn', 'always'],
      'unicode-bom': ['warn', 'never'],
      'use-isnan': 'warn',
      'valid-typeof': 'warn',

      'import/no-webpack-loader-syntax': 'error',


      'react/jsx-equals-spacing': ['warn', 'never'],
      'react/jsx-no-duplicate-props': ['warn', { ignoreCase: true }],
      'react/jsx-no-undef': 'error',
      'react/jsx-pascal-case': ['warn', {
        allowAllCaps: true,
        ignore: [],
      }],
      'react/jsx-uses-react': 'warn',
      'react/jsx-uses-vars': 'warn',
      'react/no-danger-with-children': 'warn',
      'react/no-deprecated': 'warn',
      'react/no-direct-mutation-state': 'warn',
      'react/no-is-mounted': 'warn',
      'react/react-in-jsx-scope': 'error',
      'react/require-render-return': 'warn',
      'react/style-prop-object': 'warn',
    }
  };
