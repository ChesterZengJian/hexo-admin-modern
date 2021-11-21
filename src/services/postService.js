import axios from "axios";

const prefixUrl = "/admin/api";

async function getPosts(params) {
    let url = prefixUrl + "/posts/list";
    const res = await axios.get(url, {
        params: params
    });
    return res.data;
}

export { getPosts };