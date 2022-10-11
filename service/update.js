const path = require('path');
const moment = require('moment');
const hfm = require('hexo-front-matter');
const fs = require('hexo-fs');

/**
 * Get the file name without extension
 *
 * @param {string} str
 * @return {string}
 */
function removeExtname(str) {
    return str.substring(0, str.length - path.extname(str).length);
}

module.exports = (model, id, update, callback, hexo) => {
    const post = hexo.model(model).get(id);

    if (!post) {
        return callback('Post not found');
    }

    // const config = hexo.config;
    // const slug = (post.slug = hfm.escape(
    //     post.slug || post.title,
    //     config.filename_case
    // ));
    // const layout = (post.layout = (
    //     post.layout || config.default_layout
    // ).toLowerCase());
    // const date = (post.date = post.date ? moment(post.date) : moment());

    const split = hfm.split(post.raw);
    const frontMatter = split.data;
    compiled = hfm.parse([frontMatter, '---', split.content].join('\n'));

    const preservedKeys = [
        'title',
        'date',
        'tags',
        'categories',
        '_content',
        'author',
    ];
    Object.keys(hexo.config.metadata || {}).forEach((key) => {
        preservedKeys.push(key);
    });
    const prevSourcePath = post.full_source;
    let sourcePath = prevSourcePath;
    if (update.source && update.source !== post.source) {
        // post.full_source only readable ~ see: /hexo/lib/models/post.js
        sourcePath = hexo.source_dir + update.source;
    }

    preservedKeys.forEach((attr) => {
        if (attr in update) {
            compiled[attr] = update[attr];
        }
    });
    compiled.date = moment(compiled.date).toDate();

    delete update._content;
    const raw = hfm.stringify(compiled);
    update.raw = raw;
    update.updated = moment();

    // tags and cats are only getters now. ~ see: /hexo/lib/models/post.js
    if (typeof update.tags !== 'undefined') {
        post.setTags(update.tags);
        delete update.tags;
    }
    if (typeof update.categories !== 'undefined') {
        post.setCategories(update.categories);
        delete update.categories;
    }

    Object.assign(post, update);
    post.save(() => {
        fs.writeFile(sourcePath, raw, (err) => {
            if (err) return callback(err);

            if (sourcePath !== prevSourcePath) {
                fs.unlinkSync(prevSourcePath);
                // move asset dir
                const assetPrev = removeExtname(prevSourcePath);
                const assetDest = removeExtname(sourcePath);
                fs.exists(assetPrev).then((exist) => {
                    if (exist) {
                        fs.copyDir(assetPrev, assetDest).then(() => {
                            fs.rmdir(assetPrev);
                        });
                    }
                });
            }
            hexo.source.process([post.source]).then(() => {
                callback(null);
            });
        });
    });
};
