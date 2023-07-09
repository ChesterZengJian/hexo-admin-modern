const key = 'hexo-admin-user';

const setUsername = (username) => {
    return window.localStorage.setItem(key, username);
};

const getUsername = () => {
    return window.localStorage.getItem(key);
};

const removeUsername = () => {
    return window.localStorage.removeItem(key);
};

export { setUsername, getUsername, removeUsername };
