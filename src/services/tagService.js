import axios from "axios";

const prefixUrl = "/admin/api";

async function getTags(params) {
    let url = prefixUrl + "/tags/list";
    const res = await axios.get(url, {
        params: params
    });
    return res.data;
}

export { getTags };