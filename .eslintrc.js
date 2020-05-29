// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  'globals': {
    'document': true
  },
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    'import/extensions': ['off', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    'max-len': ['error', { 'code': 300 }],
    'import/no-unresolved': [0, {commonjs: true, amd: true}],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

    /** 自定义规则 */
    "linebreak-style": 0,
    "no-console": 0,// 禁用 console
    "no-underscore-dangle": 0,
    "func-names": 0,
    "spaced-comment": 0,
    "consistent-return": 0,
    "no-param-reassign": 0,
    "object-shorthand": 0,
    "no-nested-ternary": 0,
    "padded-blocks": 0,
    "allowImplicit": 0,
  }
}
