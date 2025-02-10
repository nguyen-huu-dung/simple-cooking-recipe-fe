import { Status } from './enums';

export interface CookingRecipeMenu {
    id: number,
    name: string
}

export interface CookingRecipeTypeDish extends CookingRecipeMenu { }
export interface CookingRecipeMakeWay extends CookingRecipeMenu { }

export interface CookingRecipe {
    id: number,
    code: string,
    name: string,
    slug: string,
    introduce: string,
    menus: CookingRecipeMenu[],
    typeDish: CookingRecipeTypeDish | null,
    makeWay: CookingRecipeTypeDish | null,
    image: string | null,
    ingredients: string[],
    ration: number,
    totalTime: number,
    instructions: string[],
    status: Status,
    createdAt: string,
    updatedAt: string
}
