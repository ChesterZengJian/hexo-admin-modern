const url = require('url');

/**
 * Split the url string
 *
 * @param {string} urlStr
 * @return {Array}
 */
function spiltUrl(urlStr) {
    urlStr = url.parse(urlStr, true).pathname;

    if (urlStr[urlStr.length - 1] === '/') {
        urlStr = urlStr.slice(0, -1);
    }

    const parts = urlStr.split('/');
    return parts;
}

module.exports = spiltUrl;
