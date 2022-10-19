const jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

// function getHashPassword(pwd) {
//     const saltRounds = 10;

//     bcrypt.hash(pwd, saltRounds, function (err, pwd_hash) {
//         // Store hash in your password DB.
//         console.log('my pwd:', pwd_hash);
//         return pwd_hash;
//     });
// }

function getToken(username, secretKey) {
    const userInfo = {
        username: username,
    };
    const tokenConfig = {
        expiresIn: '30s',
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

    const config = hexo.config.admin;
    const secretKey = config.secret || 'hexo-admin-secret';
    const isPwdRight = bcrypt.compareSync(
        req.body.password,
        config.password_hash
    );

    if (req.body.username !== config.username || !isPwdRight) {
        res.badRequest('username or password error');
        return;
    }

    const tokenStr = getToken(config.username, secretKey);

    res.ok({
        message: 'login successfully',
        token: tokenStr,
    });
}

module.exports = loginService;
