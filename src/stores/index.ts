import ApiStore from './ApiStore';
import AuthStore from './AuthStore';
import CookingRecipeStore from './CookingRecipeStore';
import ModalStore from './ModalStore';
import UIStore from './UIStore';

export default class RootStore {
    modalStore: ModalStore;
    apiStore: ApiStore;
    uiStore: UIStore;
    authStore: AuthStore;
    cookingRecipeStore: CookingRecipeStore;

    constructor() {
        this.modalStore = new ModalStore();
        this.apiStore = new ApiStore(this);
        this.uiStore = new UIStore(this);
        this.authStore = new AuthStore(this);
        this.cookingRecipeStore = new CookingRecipeStore(this);
    }
}
