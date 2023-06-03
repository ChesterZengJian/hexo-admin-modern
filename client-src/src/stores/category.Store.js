import { makeAutoObservable, runInAction } from 'mobx';
import { http } from '@/utils';

class CategoryStore {
    categoryList = [];
    constructor() {
        makeAutoObservable(this);
    }
    // article publish 哪里调用这个函数呢？
    loadCategoryList = async () => {
        const res = await http.get('/admin/api/categories');
        runInAction(() => {
            this.categoryList = res.data.data;
        });
    };
}

export default CategoryStore;
