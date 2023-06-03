// custom webpack config

const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
        configure: (webpackConfig, { env, paths }) => {
            paths.appBuild = 'client';
            webpackConfig.output = {
                ...webpackConfig.output,
                path: path.resolve(__dirname, 'client'),
                publicPath: '/',
            };
            return webpackConfig;
        },
    },
};
