import React from 'react';
import { configure } from 'mobx';
import CategoryStore from './category.Store';
import TagStore from './tag.Store';

configure({
    // enforceActions: 'never',
});

class RootStore {
    constructor() {
        this.categoryStore = new CategoryStore();
        this.tagStore = new TagStore();
    }
}

const rootStore = new RootStore();
const context = React.createContext(rootStore);
const useStore = () => React.useContext(context);

export { useStore };
