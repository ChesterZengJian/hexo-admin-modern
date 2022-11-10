const { expressjwt: jwt } = require('express-jwt');
const accountService = require('./AccountService');
const categoryService = require('./categoryService');
const imageService = require('./imageService');
const { loginService, getAdminConfig } = require('./loginService');
const pageService = require('./pageService');
const postService = require('./postService');
const settingService = require('./settingService');
const tagService = require('./tagService');

/**
 * Handle circular referenc
 *
 * @param {string} k
 * @param {Object} v
 * @return {Object}
 */
function handleCircularReference(k, v) {
    // tags and cats have posts reference resulting in circular json..
    if (k == 'tags' || k == 'categories') {
        // convert object to simple array
        if (v.toArray) {
            return v.toArray().map((obj) => {
                return obj.name;
            });
        }

        return v;
    }

    return v;
}

/**
 * add the api service of hexo-admin
 *
 * @param {Object} app
 * @param {Object} hexo
 */
function addAdminService(app, hexo) {
    const { secretKey } = getAdminConfig(hexo);
    // unless 用于指明哪些 api 不需要认证
    app.use(
        '/admin/api',
        jwt({ secret: secretKey, algorithms: ['HS256'] }).unless({
            path: [/^\/admin\/api\/login/, /^\/admin\/api\/accounts/],
        })
    );

    app.use(function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            res.statusCode = 401;
            res.end('Unauthorized');
            return;
        } else {
            next(err);
        }
    });

    const use = (path, fn) => {
        const prefixUrl = hexo.config.root + 'admin/api/';

        app.use(prefixUrl + path, (req, res) => {
            res.send = (statusCode, data) => {
                res.statusCode = statusCode;
                res.end(data);
            };
            res.ok = (val) => {
                if (!val) {
                    return res.send(204, '');
                }
                res.setHeader('Content-type', 'application/json');
                return res.send(
                    200,
                    JSON.stringify(val, handleCircularReference)
                );
            };
            res.badRequest = (val) => {
                return res.send(400, val);
            };
            res.noFound = (val) => {
                return res.send(404, val);
            };
            fn(req, res, hexo);
        });
    };

    use('login', loginService);
    use('accounts', accountService);
    use('posts', postService);
    use('pages', pageService);
    use('settings', settingService);
    use('tags', tagService);
    use('categories', categoryService);
    use('images/upload', imageService);
}

module.exports = addAdminService;
