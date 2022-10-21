const jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

function getAdminConfig(hexo) {
    const config = hexo.config.admin;
    const username = config.username || 'admin';
    const secretKey = config.secret || 'hexo-admin-secret';
    const password = config.password_hash || '';

    return { username, secretKey, password };
}

function getToken(username, secretKey) {
    const userInfo = {
        username: username,
    };
    const tokenConfig = {
        expiresIn: '24h',
    };
    return jwt.sign(userInfo, secretKey, tokenConfig);
}

function loginService(req, res, hexo) {
    if (req.method != 'POST') {
        res.send(405, 'Method not allowed');
        return;
    }

    if (!req.body) {
        res.badRequest('request body is required');
        return;
    }

    if (!req.body.username || !req.body.password) {
        res.badRequest('username and password are required');
        return;
    }

    const { username, secretKey, password } = getAdminConfig(hexo);
    const isPwdRight = bcrypt.compareSync(req.body.password, password);

    if (req.body.username !== username || !isPwdRight) {
        res.badRequest('username or password error');
        return;
    }

    const tokenStr = getToken(username, secretKey);

    res.ok({
        message: 'login successfully',
        token: tokenStr,
    });
}

module.exports = { loginService, getAdminConfig };
