module.exports = {
  env: {
    browser: true,
    es2021: true,
  },

  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
  ],

  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'vue/valid-attribute-name': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
}
