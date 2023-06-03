import axios from 'axios';
import { history } from './history';
import { getToken } from './token';

const http = axios.create({
    timeout: 5000,
});

http.interceptors.request.use(
    (config) => {
        const token = getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    (res) => {
        return res;
    },
    (error) => {
        console.dir(error);

        if (error.response.status === 401) {
            history.push('/login');
        }

        return Promise.reject(error);
    }
);

export { http };
