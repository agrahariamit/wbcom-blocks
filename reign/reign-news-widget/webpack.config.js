const path = require('path');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
    ...defaultConfig,
    entry: {
        index: path.resolve(__dirname, 'src', 'index.js'), // Editor script
        frontend: path.resolve(__dirname, 'src', 'frontend.js'), // Frontend script
    },
    output: {
        ...defaultConfig.output,
        filename: '[name].js', // Output as index.js and frontend.js
    },
};
