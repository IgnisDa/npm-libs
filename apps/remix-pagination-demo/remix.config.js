const { dirname, join } = require('node:path');

const outputPath = join(
  dirname(dirname(__dirname)),
  'dist',
  'apps',
  'remix-pagination-demo'
);

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  assetsBuildDirectory: IS_PRODUCTION
    ? `${outputPath}/public/build`
    : undefined,
  serverBuildPath: IS_PRODUCTION ? `${outputPath}/index.js` : undefined,
};
