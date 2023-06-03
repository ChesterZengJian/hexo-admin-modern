import { makeAutoObservable, runInAction } from 'mobx';
import {
    getUsername,
    getToken,
    setToken,
    removeToken,
    http,
    setUsername,
    removeUsername,
} from '@/utils';

class loginStore {
    token = getToken() || '';
    username = getUsername() || 'admin';

    constructor() {
        makeAutoObservable(this);
    }

    login = async ({ username, password }) => {
        const res = await http.post('/admin/api/login', {
            username,
            password,
        });

        runInAction(() => {
            this.token = res.data.token;
            this.username = res.data.username;
            // 存入ls
            setToken(this.token);
            setUsername(this.username);
        });
    };

    // 退出登录
    loginOut = () => {
        this.token = '';
        removeToken();
        removeUsername();
    };
}

export default loginStore;
