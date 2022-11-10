const spiltUrl = require('../utils/spiltUrl');
const yml = require('js-yaml');
const fs = require('hexo-fs');

/**
 * reads admin panel settings from _admin-config.yml
 * or writes it if it does not exist
 *
 * @param {Object} hexo
 * @return {Object}
 */
function querySettings(hexo) {
    const path = `${hexo.base_dir}_admin-config.yml`;

    if (!fs.existsSync(path)) {
        hexo.log.d('admin config not found, creating one');
        fs.writeFile(hexo.base_dir + '_admin-config.yml', '');
        return {};
    }

    const settings = yml.safeLoad(fs.readFileSync(path));

    if (!settings) return {};
    return settings;
}

/**
 * Provider settings operation service
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} hexo
 */
function settingService(req, res, hexo) {
    const parts = spiltUrl(req.url);

    if (req.method === 'GET') {
        if (parts.length == 2) {
            res.noFound();
            return;
        }

        res.ok(querySettings(hexo));
    } else {
        res.badRequest('Not support this method');
    }
}

module.exports = settingService;
