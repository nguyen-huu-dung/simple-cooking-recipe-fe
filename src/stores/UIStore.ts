import { action, makeObservable, observable } from 'mobx';
import RootStore from '.';
import BaseStore from './BaseStore';
import { getStorage, saveLocalStorage } from '@/utils/browsers';

export default class UIStore extends BaseStore {
    isOpenSidebar: boolean = getStorage('isOpenSidebar') === 'true';

    constructor(rootStore: RootStore) {
        super(rootStore);
        makeObservable(this, {
            isOpenSidebar: observable,
            setOpenSidebar: action.bound
        });
    }

    setOpenSidebar(value?: boolean) {
        if (value === undefined) {
            this.isOpenSidebar = !this.isOpenSidebar;
        } else {
            this.isOpenSidebar = value;
        }
        saveLocalStorage('isOpenSidebar', String(this.isOpenSidebar));
    }
}
