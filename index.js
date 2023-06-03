const bodyParser = require('body-parser');
const path = require('path');
const serveStatic = require('serve-static');
const addAdminService = require('./service');

hexo.extend.filter.register('server_middleware', (app) => {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    console.log(
        'admin loading',
        `${hexo.config.root}admin`,
        path.join(__dirname, 'client')
    );
    app.use(
        `${hexo.config.root}admin`,
        serveStatic(path.join(__dirname, 'client'))
    );

    addAdminService(app, hexo);
});
