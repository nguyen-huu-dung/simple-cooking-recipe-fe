import { CookingRecipe } from '../cookingRecipe';
import { Status } from '../enums';
import { PagingResponse } from '../http';

// #region Cooking Recipe Secondary Data
export interface CookingRecipeSecondaryDataGetRequest {
    cookingRecipeMenu?: boolean,
    cookingRecipeTypeDish?: boolean,
    cookingRecipeMakeWay?: boolean
}

export interface CookingRecipeSecondaryData {
    id: number,
    name: string
}

export interface CookingRecipeSecondaryDataGetResponse {
    cookingRecipeMenus: CookingRecipeSecondaryData[],
    cookingRecipeTypeDishs: CookingRecipeSecondaryData[],
    cookingRecipeMakeWays: CookingRecipeSecondaryData[]
}

// #endregion

// #region Cooking Recipe Create
export interface CookingRecipePostRequest {
    name: string,
    introduce: string,
    menus: number[],
    typeDish: number | null,
    makeWay: number | null,
    image: string | File,
    ingredients: string[],
    ration: number,
    totalTime: number,
    instructions: string[]
}

export interface CookingRecipePostResponse {
}

// #endregion

// #region Cooking Recipe Get
export interface MyListCookingRecipeGetRequest {
    code?: string,
    name?: string
}

export interface MyListCookingRecipeGetResponse {
    elements: CookingRecipe[],
    pagination: PagingResponse
}

export interface MyCookingRecipeGetRequest {
    code: string
}

export interface MyCookingRecipeGetResponse extends CookingRecipe { }

export interface ListCookingRecipePostRequest {
    name?: string,
    isRelated?: boolean,
    slug?: string,
    menus?: number[],
    typeDishs?: number[],
    makeWays?: number[]
}

export interface ListCookingRecipePostResponse {
    elements: CookingRecipe[],
    pagination: PagingResponse,
    totalCookingRecipes: number
}

export interface CookingRecipeGetRequest {
    slug: string
}

export interface CookingRecipeGetResponse extends CookingRecipe { }

// #region Cooking Recipe Update
export interface CookingRecipeStatusPutRequest {
    code: string,
    status: Status
}

export interface CookingRecipeStatusPutResponse {
}

export interface CookingRecipePutRequest extends CookingRecipePostRequest {
    code: string
}
export interface CookingRecipePutResponse extends CookingRecipePostResponse { }

// #endregion

// #region Cooking Recipe Delete
export interface CookingRecipeDeleteRequest {
    code: string
}

export interface CookingRecipeDeleteResponse {
}

// #endregion
