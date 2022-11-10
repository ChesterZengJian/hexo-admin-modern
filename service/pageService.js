const url = require('url');
const spiltUrl = require('../utils/spiltUrl');

/**
 * Query the page by id
 *
 * @param {String} id
 * @param {Object} res
 * @param {Object} hexo
 */
function queryPageById(id, res, hexo) {
    const page = hexo.model('Page').get(id);

    if (!page) {
        res.noFound('Page not found');
        return;
    }

    res.ok(page);
}

/**
 * Query page List
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} hexo
 */
function queryPageList(req, res, hexo) {
    const queryStr = url.parse(req.url, true).query;

    const param = {
        curPage: parseInt(queryStr.curPage) || 1,
        pageSize: parseInt(queryStr.pageSize) || 10,
        sortField: queryStr.sort || 'date',
        order: parseInt(queryStr.order) || -1,
    };

    let pages = hexo.model('Page');
    const filterSql = [];

    if (param.isPublished) {
        filterSql.push({ published: param.isPublished === 1 ? true : false });
    }

    pages = pages.find({ $and: filterSql });

    if (queryStr.title) {
        pages = pages.find({}).filter((data) => {
            return (
                data.title
                    .toLowerCase()
                    .indexOf(queryStr.title.toLocaleLowerCase()) >= 0
            );
        });
    }

    total = pages.count();
    pages = pages.sort(param.sortField, param.order).find(
        {},
        {
            skip: (param.curPage - 1) * param.pageSize,
            limit: param.pageSize,
        }
    );

    res.ok({
        total: total,
        data: pages.toArray(),
    });
}

/**
 * Create the page
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} hexo
 */
function createPage(req, res, hexo) {
    if (!req.body) {
        res.badRequest('No page body given');
        return;
    }

    if (!req.body.title) {
        res.badRequest('No title given');
        return;
    }

    const pageParameters = {
        title: req.body.title,
        layout: 'page',
        date: new Date(),
    };

    hexo.post
        .create(pageParameters)
        .error((err) => {
            console.error(err, err.stack);
            return res.send(500, 'Failed to create page');
        })
        .then((file) => {
            const source = file.path.slice(hexo.source_dir.length);

            hexo.source.process([source]).then(() => {
                const page = hexo
                    .model('Page')
                    .find({ source: source.replace(/\\/g, '/') })
                    .first();
                res.ok(page);
            });
        });
}

/**
 * Update the page by id
 *
 * @param {String} id
 * @param {Object} body
 * @param {Object} res
 * @param {Object} hexo
 */
function updatePage(id, body, res, hexo) {}

/**
 * Delete the page
 *
 * @param {String} id
 * @param {Object} res
 * @param {Object} hexo
 */
function deletePage(id, res, hexo) {}

/**
 * Provider pages operation service
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} hexo
 */
function pageService(req, res, hexo) {
    const parts = spiltUrl(req.url);
    const last = parts[parts.length - 1];

    if (req.method === 'GET') {
        if (parts.length == 2) {
            const id = last;
            queryPageById(id, res, hexo);
            return;
        }

        queryPageList(req, res, hexo);
    } else if (req.method === 'POST') {
        createPage(req, res, hexo);
    } else if (req.method === 'PUT') {
        if (parts.length === 3) {
            const id = parts[parts.length - 2];
            updatePageFactory[last](id, res, hexo);
            return;
        }

        const id = last;
        updatePage(id, req.body, res, hexo);
    } else if (req.method === 'DELETE') {
        if (parts.length !== 2) {
            res.badRequest('Invalid page id');
            return;
        }

        const id = last;
        deletePage(id, res, hexo);
    } else {
        res.badRequest('Not support this method');
    }
}

module.exports = pageService;
