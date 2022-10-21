var bcrypt = require('bcrypt');

function getHashPassword(pwd) {
    const saltRounds = 10;
    return bcrypt.hashSync(pwd, saltRounds);
}

function accountService(req, res, hexo) {
    if (req.method != 'POST') {
        res.send(405, 'Method not allowed');
        return;
    }

    if (!req.body) {
        res.badRequest('request body is required');
        return;
    }

    const username = req.body.username;
    const password = req.body.password;
    const secret = req.body.secret;

    if (!username || !password || !secret) {
        res.badRequest('username, password, secret are required');
        return;
    }

    const password_hash = getHashPassword(password);

    res.ok({
        username: username,
        password: password_hash,
        secret: secret,
    });
}

module.exports = accountService;
