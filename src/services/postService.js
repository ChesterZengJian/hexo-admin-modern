import axios from "axios";

const prefixUrl = "/admin/api";

async function getPosts(params) {
    let url = prefixUrl + "/posts/list";
    console.log(params)
    const res = await axios.get(url, {
        params: params
    });
    return res.data;
}

async function createPost(params) {
    let url = prefixUrl + "/posts/new";
    console.log(params)
    const res = await axios.post(url, params);
    return res;
}

async function removePost(id) {
    let url = prefixUrl + "/posts/" + id + "/remove";
    const res = await axios.post(url);
    return res;
}

async function publishPost(id) {
    let url = prefixUrl + "/posts/" + id + "/publish";
    const res = await axios.post(url);
    return res;
}

async function unpublishPost(id) {
    let url = prefixUrl + "/posts/" + id + "/unpublish";
    const res = await axios.post(url);
    return res;
}

export { getPosts, createPost, removePost, publishPost, unpublishPost };