const config = require('@backstage/cli/config/eslint-factory')(__dirname);

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    '@backstage/no-mixed-plugin-imports': 'off',
  },
};
