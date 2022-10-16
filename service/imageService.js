const path = require('path');
const fs = require('hexo-fs');
const yml = require('js-yaml');

// reads admin panel settings from _admin-config.yml
// or writes it if it does not exist
function getSettings(hexo) {
    const filePath = path.join(hexo.base_dir, '_admin-config.yml');

    console.log('settings path:', filePath);

    if (!fs.existsSync(filePath)) {
        console.log('admin config not found, creating one');
        // fs.writeFile(hexo.base_dir + '_admin-config.yml', '');
        fs.writeFile(filePath);
        return {};
    } else {
        var settings = yml.safeLoad(fs.readFileSync(filePath));

        if (!settings) return {};

        return settings;
    }
}

function uploadImage(req, res, hexo) {
    console.log('uploading image');

    if (!req.body) {
        return res.badRequest('No post body given');
    }

    if (!req.body.data) {
        return res.badRequest('No data given');
    }
    var settings = getSettings(hexo);

    var imagePath = '/images';
    var imagePrefix = 'pasted-';
    var askImageFilename = false;
    var overwriteImages = false;
    // check for image settings and set them if they exist
    if (settings.options) {
        askImageFilename = !!settings.options.askImageFilename;
        overwriteImages = !!settings.options.overwriteImages;
        imagePath = settings.options.imagePath
            ? settings.options.imagePath
            : imagePath;
        imagePrefix = settings.options.imagePrefix
            ? settings.options.imagePrefix
            : imagePrefix;
    }

    var msg = 'upload successful';
    var i = 0;
    while (
        fs.existsSync(
            path.join(hexo.source_dir, imagePath, imagePrefix + i + '.png')
        )
    ) {
        i += 1;
    }
    var filename = path.join(imagePrefix + i + '.png');
    if (req.body.filename) {
        var givenFilename = req.body.filename;
        // check for png ending, add it if not there
        var index = givenFilename.toLowerCase().indexOf('.png');
        if (index < 0 || index != givenFilename.length - 4) {
            givenFilename += '.png';
        }
        console.log('trying custom filename', givenFilename);
        if (
            fs.existsSync(path.join(hexo.source_dir, imagePath, givenFilename))
        ) {
            if (overwriteImages) {
                console.log('file already exists, overwriting');
                msg = 'overwrote existing file';
                filename = givenFilename;
            } else {
                console.log('file already exists, using', filename);
                msg = 'filename already exists, renamed';
            }
        } else {
            filename = givenFilename;
        }
    }

    filename = path.join(imagePath, filename);
    var outpath = path.join(hexo.source_dir, filename);

    var dataURI = req.body.data.slice('data:image/png;base64,'.length);
    var buf = new Buffer(dataURI, 'base64');
    console.log(`saving image to ${outpath}`);
    fs.writeFile(outpath, buf, function (err) {
        if (err) {
            console.log(err);
        }
        hexo.source.process().then(function () {
            res.ok({
                src: path.join(hexo.config.root + filename),
                msg: msg,
            });
        });
    });
}

function imageService(req, res, hexo) {
    if (req.method !== 'POST') {
        res.badRequest('Not support this method');
        return;
    }

    uploadImage(req, res, hexo);
}

module.exports = imageService;
