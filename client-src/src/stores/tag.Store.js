import { makeAutoObservable, runInAction } from 'mobx';
import { http } from '@/utils';

class TagStore {
    tagList = [];

    constructor() {
        makeAutoObservable(this);
    }

    loadTagList = async () => {
        const res = await http.get('/admin/api/tags');
        runInAction(() => {
            this.tagList = res.data.data;
        });
    };
}

export default TagStore;
