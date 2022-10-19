import { makeAutoObservable, runInAction } from 'mobx';
import { getToken, setToken, removeToken, http } from '@/utils';

class loginStore {
    token = getToken() || '';

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
            // 存入ls
            setToken(this.token);
        });
    };

    // 退出登录
    loginOut = () => {
        this.token = '';
        removeToken();
    };
}

export default loginStore;
