/**
 * Query tag list
 *
 * @param {Object} res
 * @param {Object} hexo
 */
function queryTagList(res, hexo) {
    const tags = hexo.model('Tag');
    const total = tags.count();
    res.ok({
        total: total,
        data: tags
            .map((c) => {
                return {
                    _id: c._id,
                    name: c.name,
                };
            })
            .sort((a, b) => {
                const x = a.name.toLowerCase();
                const y = b.name.toLowerCase();
                if (x < y) {
                    return -1;
                }
                if (x > y) {
                    return 1;
                }
                return 0;
            }),
    });
}

/**
 * Provider tag operation service
 *
 * @param {*} req
 * @param {*} res
 * @param {*} hexo
 */
function tagService(req, res, hexo) {
    if (req.method === 'GET') {
        queryTagList(res, hexo);
    } else {
        res.badRequest('Not support this method');
    }
}

module.exports = tagService;
