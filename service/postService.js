const url = require('url');
const spiltUrl = require('../utils/spiltUrl');
const updateAny = require('./update');
const update = updateAny.bind(null, 'Post');

const postDir = '_posts';
const draftDir = '_drafts';
const discardedDir = '_discarded';
const updatePostFactory = {
    publish: (id, res, hexo) => {
        publishPost(id, res, hexo);
    },
    unpublish: (id, res, hexo) => {
        unpublishPost(id, res, hexo);
    },
};

/**
 * Add isDraft property to post
 *
 * @param {Object} post
 * @return {Object}
 */
function constructPost(post) {
    post.isDraft = post.source.indexOf('_draft') === 0;
    post.isDiscarded = post.source.indexOf(discardedDir) === 0;
    return post;
}

/**
 * Query the post list
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} hexo
 */
function queryPostList(req, res, hexo) {
    const queryStr = url.parse(req.url, true).query;

    const param = {
        curPage: parseInt(queryStr.curPage) || 1,
        pageSize: parseInt(queryStr.pageSize) || 10,
        sortField: queryStr.sort || 'date',
        order: parseInt(queryStr.order) || -1,
        isDiscarded: parseInt(queryStr.isDiscarded) || 0,
        isPublished: parseInt(queryStr.isPublished) || 0,
    };

    let posts = hexo.model('Post');
    const filterSql = [];

    if (param.isPublished) {
        filterSql.push({ published: param.isPublished === 1 ? true : false });
    }

    if (param.isDiscarded === 1) {
        filterSql.push({
            $where() {
                return this.source.indexOf(discardedDir) === 0;
            },
        });
    } else {
        filterSql.push({
            $where() {
                return this.source.indexOf(discardedDir) !== 0;
            },
        });
    }

    posts = posts.find({ $and: filterSql });

    if (queryStr.title) {
        posts = posts.find({}).filter((data) => {
            return (
                data.title
                    .toLowerCase()
                    .indexOf(queryStr.title.toLocaleLowerCase()) >= 0
            );
        });
    }

    total = posts.count();
    posts = posts.sort(param.sortField, param.order).find(
        {},
        {
            skip: (param.curPage - 1) * param.pageSize,
            limit: param.pageSize,
        }
    );

    res.ok({
        total: total,
        data: posts.toArray().map(constructPost),
    });
}

/**
 * Query a post by post id
 *
 * @param {string} id
 * @param {Object} res
 * @param {Object} hexo
 */
function queryPostById(id, res, hexo) {
    const post = hexo.model('Post').get(id);

    if (!post) {
        res.noFound('Post not found');
        return;
    }

    res.ok(constructPost(post));
}

/**
 * Create a new post
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} hexo
 */
function createPost(req, res, hexo) {
    if (!req.body) {
        res.badRequest('No post body given');
        return;
    }

    if (!req.body.title) {
        res.badRequest('No title given');
        return;
    }

    const postParameters = {
        title: req.body.title,
        categories: req.body.categories,
        tags: req.body.tags,
        _content: req.body.content,
        layout: 'draft',
        date: new Date(),
        author: hexo.config.author,
    };

    Object.assign(postParameters, hexo.config.metadata || {});

    hexo.post
        .create(postParameters)
        .error((err) => {
            console.error(err, err.stack);
            return res.send(500, 'Failed to create post');
        })
        .then((file) => {
            const source = file.path.slice(hexo.source_dir.length);
            hexo.source.process([source]).then(() => {
                const post = hexo
                    .model('Post')
                    .findOne({ source: source.replace(/\\/g, '/') });
                res.ok(constructPost(post));
            });
        });
}

/**
 * Update a post
 *
 * @param {string} id
 * @param {Object} body
 * @param {Object} res
 * @param {Object} hexo
 */
function updatePost(id, body, res, hexo) {
    if (!body) {
        res.badRequest('No post body given');
        return;
    }

    const post = hexo.model('Post').get(id);

    if (!post) {
        res.noFound('Post not found');
        return;
    }

    update(
        id,
        body,
        (err) => {
            if (err) {
                res.badRequest(err);
                return;
            }
            res.ok();
        },
        hexo
    );
}

/**
 * Publish a post
 *
 * @param {string} id
 * @param {Object} res
 * @param {Object} hexo
 */
function publishPost(id, res, hexo) {
    const post = hexo.model('Post').get(id);

    if (!post) {
        res.noFound('Post not found');
        return;
    }

    if (post.source.indexOf(`${postDir}/`) === 0) {
        res.ok();
        return;
    }

    const newSource = `${postDir}/${post.source.slice(`${draftDir}/`.length)}`;

    update(
        id,
        { source: newSource },
        (err) => {
            if (err) {
                return res.badRequest(err);
            }
            res.ok();
        },
        hexo
    );
}

/**
 * Unpublish a post
 *
 * @param {string} id
 * @param {object} res
 * @param {object} hexo
 */
function unpublishPost(id, res, hexo) {
    const post = hexo.model('Post').get(id);

    if (!post) {
        res.noFound('Post not found');
        return;
    }

    if (post.source.indexOf(`${draftDir}/`) === 0) {
        res.ok();
        return;
    }

    const newSource = `${draftDir}/${post.source.slice(`${postDir}/`.length)}`;

    update(
        id,
        { source: newSource },
        (err) => {
            if (err) {
                return res.badRequest(err);
            }
            res.ok();
        },
        hexo
    );
}

/**
 * Delete a post
 *
 * @param {Object} id
 * @param {Object} res
 * @param {Object} hexo
 */
function deletePost(id, res, hexo) {
    const post = hexo.model('Post').get(id);

    if (!post) {
        res.noFound('Post not found');
        return;
    }

    if (post.source.indexOf(`${discardedDir}/`) === 0) {
        res.ok();
        return;
    }

    if (post.source.indexOf(`${draftDir}/`) === -1) {
        res.badRequest('Post not be draft');
        return;
    }

    const newSource = `${discardedDir}/${post.source.slice(
        `${draftDir}/`.length
    )}`;

    update(
        id,
        { source: newSource },
        (err) => {
            if (err) {
                res.badRequest(err);
                return;
            }
            res.ok();
        },
        hexo
    );
}

/**
 * Provide Posts operation service
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} hexo
 */
function postService(req, res, hexo) {
    const parts = spiltUrl(req.url);
    const last = parts[parts.length - 1];

    if (req.method === 'GET') {
        if (parts.length == 2) {
            const id = last;
            queryPostById(id, res, hexo);
            return;
        }

        queryPostList(req, res, hexo);
    } else if (req.method === 'POST') {
        createPost(req, res, hexo);
    } else if (req.method === 'PUT') {
        if (parts.length === 3) {
            const id = parts[parts.length - 2];
            updatePostFactory[last](id, res, hexo);
            return;
        }

        const id = last;
        updatePost(id, req.body, res, hexo);
    } else if (req.method === 'DELETE') {
        if (parts.length !== 2) {
            res.badRequest('Invalid post id');
            return;
        }

        const id = last;
        deletePost(id, res, hexo);
    } else {
        res.badRequest('Not support this method');
    }
}

module.exports = postService;
