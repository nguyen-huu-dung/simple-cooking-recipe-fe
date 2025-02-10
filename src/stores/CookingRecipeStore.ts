import { DEFAULT_PAGINATION } from '@/configs/constants';
import { action, flow, makeObservable, observable } from 'mobx';
import RootStore from '.';
import BaseStore from './BaseStore';
import CookingRecipeApi from '@/apis/CookingRecipeApi';
import { MyListCookingRecipeGetRequest, MyListCookingRecipeGetResponse, CookingRecipePostRequest, CookingRecipePostResponse, CookingRecipeSecondaryData, CookingRecipeSecondaryDataGetRequest, CookingRecipeSecondaryDataGetResponse, CookingRecipeStatusPutRequest, CookingRecipeStatusPutResponse, CookingRecipeDeleteRequest, CookingRecipeDeleteResponse, MyCookingRecipeGetRequest, MyCookingRecipeGetResponse, CookingRecipePutRequest, CookingRecipePutResponse, ListCookingRecipePostRequest, ListCookingRecipePostResponse, CookingRecipeGetRequest, CookingRecipeGetResponse } from '@/types/http-payload/cookingRecipe';
import { ResponseData } from '@/types/http';
import { CookingRecipe } from '@/types/cookingRecipe';
import { ColumnSort, TableState } from '@tanstack/react-table';

export default class CookingRecipeStore extends BaseStore {
    api: CookingRecipeApi;
    cookingRecipeMenus: CookingRecipeSecondaryData[] = [];
    cookingRecipeTypeDishs: CookingRecipeSecondaryData[] = [];
    cookingRecipeMakeWays: CookingRecipeSecondaryData[] = [];
    cookingRecipe: CookingRecipe | undefined;
    cookingRecipes: CookingRecipe[] | undefined;
    recomendCookingRecipes: CookingRecipe[] | undefined;

    // paging for home page
    defaultPagingCookingRecipesHome: TableState = {
        pagination: {
            ...DEFAULT_PAGINATION,
            pageSize: 12
        },
        sorting: [{}]
    } as TableState;

    pagingCookingRecipesHome: TableState = this.defaultPagingCookingRecipesHome;

    totalCookingRecipes: number = 0;

    // key search
    keySearch: string = new URLSearchParams(window.location.search).get('keySearch') ?? '';
    sortingSearch?: ColumnSort[];
    filterSearch: Pick<ListCookingRecipePostRequest, 'menus' | 'typeDishs' | 'makeWays'> = {
        menus: [],
        typeDishs: [],
        makeWays: []
    };

    constructor(rootStore: RootStore) {
        super(rootStore);
        makeObservable(this, {
            cookingRecipeMenus: observable,
            cookingRecipeTypeDishs: observable,
            cookingRecipeMakeWays: observable,
            cookingRecipe: observable,
            cookingRecipes: observable,
            recomendCookingRecipes: observable,
            totalCookingRecipes: observable,
            keySearch: observable,
            filterSearch: observable,
            getCookingRecipeSecondaryData: flow.bound,
            createMyCookingRecipe: flow.bound,
            getMyListCookingRecipe: flow.bound,
            getListCookingRecipe: flow.bound,
            getMyCookingRecipe: flow.bound,
            getCookingRecipe: flow.bound,
            getRecommendListCookingRecipe: flow.bound,
            updateStatusMyCookingRecipe: flow.bound,
            updateMyCookingRecipe: flow.bound,
            deleteMyCookingRecipe: flow.bound,
            setKeySearch: action.bound,
            setSortingSort: action.bound,
            setFilterSearch: action.bound
        });
        this.api = new CookingRecipeApi();
    }

    *getCookingRecipeSecondaryData(payload: CookingRecipeSecondaryDataGetRequest) {
        try {
            const res: ResponseData<CookingRecipeSecondaryDataGetResponse> = yield this.rootStore.apiStore.call(this.api, this.api.getCookingRecipeSecondaryData, payload);
            if (res?.ok) {
                const { cookingRecipeMenu, cookingRecipeTypeDish, cookingRecipeMakeWay } = payload;
                const { cookingRecipeMenus = [], cookingRecipeTypeDishs = [], cookingRecipeMakeWays = [] } = res.data;

                if (cookingRecipeMenu) {
                    this.cookingRecipeMenus = cookingRecipeMenus;
                }

                if (cookingRecipeTypeDish) {
                    this.cookingRecipeTypeDishs = cookingRecipeTypeDishs;
                }

                if (cookingRecipeMakeWay) {
                    this.cookingRecipeMakeWays = cookingRecipeMakeWays;
                }
            }
        } catch (error) {
        }
    }

    *createMyCookingRecipe(payload: CookingRecipePostRequest) {
        try {
            const res: ResponseData<CookingRecipePostResponse> = yield this.rootStore.apiStore.call(this.api, this.api.createMyCookingRecipe, payload);
            return !!res?.ok;
        } catch (error) {
        }
    }

    *getMyListCookingRecipe(searchParams?: MyListCookingRecipeGetRequest, paging?: TableState) {
        try {
            const payload = { ...this.convertPagingFromTableToRequest(paging ?? this.paging), ...searchParams };
            const res: ResponseData<MyListCookingRecipeGetResponse> = yield this.rootStore.apiStore.call(this.api, this.api.getMyListCookingRecipe, payload);
            if (res.ok) {
                this.cookingRecipes = res.data.elements ?? [];
                this.paging = {
                    ...this.paging,
                    sorting: paging?.sorting ?? [],
                    pagination: this.convertPaginationFromRequestToTable(res.data.pagination)
                };
                this.totalRecord = res.data.pagination.totalRecord;
            }
        } catch (error) {
        }
    }

    *getListCookingRecipe(searchParams?: ListCookingRecipePostRequest, paging?: TableState, isViewMore?: boolean) {
        try {
            const payload = {
                ...this.convertPagingFromTableToRequest({
                    ...paging ?? this.pagingCookingRecipesHome,
                    ...this.sortingSearch ?
                        {
                            sorting: this.sortingSearch
                        } :
                        {}
                }),
                ...searchParams,
                ...this.keySearch ?
                    {
                        name: this.keySearch
                    } :
                    {},
                ...this.filterSearch,
                ...isViewMore ?
                    {
                        displayedCookingRecipes: this.cookingRecipes !== undefined ? this.cookingRecipes.map(e => e.id) : []
                    } :
                    {}
            };
            const res: ResponseData<ListCookingRecipePostResponse> = yield this.rootStore.apiStore.call(this.api, this.api.getListCookingRecipe, payload);
            if (res?.ok) {
                this.cookingRecipes = [
                    ...isViewMore ? this.cookingRecipes ?? [] : [],
                    ...res.data.elements ?? []
                ];
                this.pagingCookingRecipesHome = {
                    ...this.pagingCookingRecipesHome,
                    sorting: paging?.sorting ?? [],
                    pagination: this.convertPaginationFromRequestToTable(res.data.pagination)
                };
                this.totalRecord = res.data.pagination.totalRecord;
                this.totalCookingRecipes = res.data.totalCookingRecipes || 0;
            }
        } catch (error) {
        }
    }

    *getRecommendListCookingRecipe() {
        try {
            const payload = {
                page: 1,
                size: 5,
                sorting: [{
                    sortKey: 'shuffle'
                }]
            };
            const res: ResponseData<ListCookingRecipePostResponse> = yield this.rootStore.apiStore.call(this.api, this.api.getListCookingRecipe, payload);
            if (res.ok) {
                this.recomendCookingRecipes = res.data.elements ?? [];
            }
        } catch (error) {
        }
    }

    *getMyCookingRecipe(payload: MyCookingRecipeGetRequest) {
        try {
            const res: ResponseData<MyCookingRecipeGetResponse> = yield this.rootStore.apiStore.call(this.api, this.api.getMyCookingRecipe, payload);
            if (res?.ok) {
                this.cookingRecipe = res.data;
                return res.data;
            }
            return undefined;
        } catch (error) {
        }
    }

    * getCookingRecipe(payload: CookingRecipeGetRequest) {
        try {
            const res: ResponseData<CookingRecipeGetResponse> = yield this.rootStore.apiStore.call(this.api, this.api.getCookingRecipe, payload);
            if (res?.ok) {
                this.cookingRecipe = res.data;
                return res.data;
            }
            return undefined;
        } catch (error) {
        }
    }

    * updateStatusMyCookingRecipe(payload: CookingRecipeStatusPutRequest) {
        try {
            const res: ResponseData<CookingRecipeStatusPutResponse> = yield this.rootStore.apiStore.call(this.api, this.api.updateStatusMyCookingRecipe, payload);
            return !!res?.ok;
        } catch (error) {
        }
    }

    * updateMyCookingRecipe(payload: CookingRecipePutRequest) {
        try {
            const res: ResponseData<CookingRecipePutResponse> = yield this.rootStore.apiStore.call(this.api, this.api.updateMyCookingRecipe, payload);
            return !!res?.ok;
        } catch (error) {
        }
    }

    * deleteMyCookingRecipe(payload: CookingRecipeDeleteRequest) {
        try {
            const res: ResponseData<CookingRecipeDeleteResponse> = yield this.rootStore.apiStore.call(this.api, this.api.deleteMyCookingRecipe, payload);
            return !!res?.ok;
        } catch (error) {
        }
    }

    setKeySearch(value: string = '') {
        this.keySearch = value;
    }

    setSortingSort(value: ColumnSort[]) {
        this.sortingSearch = value;
    }

    setFilterSearch(value: Pick<ListCookingRecipePostRequest, 'menus' | 'typeDishs' | 'makeWays'>) {
        this.filterSearch = value;
    }

    clean() {
        super.clean();
        this.cookingRecipe = undefined;
        this.cookingRecipes = undefined;
        this.totalCookingRecipes = 0;
        this.pagingCookingRecipesHome = this.defaultPagingCookingRecipesHome;
    }
}
