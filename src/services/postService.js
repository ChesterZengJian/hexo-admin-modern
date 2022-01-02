import axios from "axios";

const prefixUrl = "/admin/api";

async function getPosts(params) {
    let url = prefixUrl + "/posts/list";
    // console.log(params)
    const res = await axios.get(url, {
        params: params
    });
    return res.data;
}

async function getPost(id) {
    let url = prefixUrl + "/posts/" + id;
    const res = await axios.get(url);
    return res.data;
}

async function createPost(params) {
    let url = prefixUrl + "/posts/new";
    // console.log(params)
    const res = await axios.post(url, params);
    return res;
}

async function editPost(id, params) {
    let url = prefixUrl + "/posts/" + id;
    // console.log(params)
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

const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

async function uploadImage(params) {
    // console.log("params:");
    // console.log(params);
    const newPic = params;
    const url = `${prefixUrl}/images/upload`;

    return convertFileToBase64(newPic).then(async (res) => {
        return (await axios.post(url, {
            data: res,
            filename: null,
        })).data;

        // return httpClient(url, {
        //     method: "POST",
        //     body: JSON.stringify({
        //         data: res,
        //         filename: null,
        //     }),
        // }).then(({ json }) => {
        //     return json;
        // });
    });
}

export { getPosts, getPost, createPost, editPost, removePost, publishPost, unpublishPost, uploadImage };