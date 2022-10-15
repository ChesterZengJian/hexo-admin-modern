import React from 'react';
import CategoryStore from './category.Store';
import { configure } from 'mobx';

configure({
    // enforceActions: 'never',
});

class RootStore {
    constructor() {
        this.categoryStore = new CategoryStore();
    }
}

const rootStore = new RootStore();
const context = React.createContext(rootStore);
const useStore = () => React.useContext(context);

export { useStore };
