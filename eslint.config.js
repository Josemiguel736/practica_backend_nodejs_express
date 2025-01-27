module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['jest'],
  rules: {
    // Añade reglas personalizadas aquí
    'no-unused-vars': 'warn',
    semi: ['error', 'always'],
    quotes: ['error', 'double']
  }
}
