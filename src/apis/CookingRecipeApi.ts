import ApiService from './ApiService';

export default class CookingRecipeApi extends ApiService {
    getCookingRecipeSecondaryData(payload) {
        return this.get('cooking-recipe-secondary-data', payload);
    }

    createMyCookingRecipe(payload) {
        return this.post('my-cooking-recipe', payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    getMyListCookingRecipe(payload) {
        return this.get('my-cooking-recipe', payload);
    }

    getListCookingRecipe(payload) {
        return this.post('cooking-recipe', payload);
    }

    getMyCookingRecipe({ code, ...otherPayload }) {
        return this.get(`my-cooking-recipe/${code}`, otherPayload);
    }

    getCookingRecipe({ slug, ...otherPayload }) {
        return this.get(`cooking-recipe/${slug}`, otherPayload);
    }

    updateStatusMyCookingRecipe({ code, ...otherPayload }) {
        return this.put(`my-cooking-recipe/status/${code}`, otherPayload);
    }

    updateMyCookingRecipe({ code, ...otherPayload }) {
        return this.put(`my-cooking-recipe/${code}`, otherPayload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    deleteMyCookingRecipe({ code, ...otherPayload }) {
        return this.delete(`my-cooking-recipe/${code}`, otherPayload);
    }
}
