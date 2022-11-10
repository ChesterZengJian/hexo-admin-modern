/**
 * Query tag list
 *
 * @param {Object} res
 * @param {Object} hexo
 */
function queryCategoryList(res, hexo) {
    const categories = hexo.model('Category');
    const total = categories.count();
    res.ok({
        total: total,
        data: categories
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
function categoryService(req, res, hexo) {
    if (req.method === 'GET') {
        queryCategoryList(res, hexo);
    } else {
        res.badRequest('Not support this method');
    }
}

module.exports = categoryService;
