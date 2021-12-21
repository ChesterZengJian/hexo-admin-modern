import axios from "axios";

const prefixUrl = "/admin/api";

async function getCategories(params) {
    let url = prefixUrl + "/categories/list";
    const res = await axios.get(url, {
        params: params
    });
    return res.data;
}

export { getCategories };