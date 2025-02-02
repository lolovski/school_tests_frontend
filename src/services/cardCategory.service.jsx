import axios from 'axios';


class CardCategoryService {
    baseURL = 'http://localhost:8000/card_category';

    async getCardCategories(parent_category_id = null) {
        const {data} = await axios.get(`${this.baseURL}/`,
            {
                params: {
                    parent_category_id
                }
            }
        );
        return data;
    }

    async getCardCategory(id) {
        const {data} = await axios.get(`${this.baseURL}/${id}`);
        return data;
    }

    async createCardCategory(data) {

        const {response} = await axios.post(this.baseURL,
            data,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        return response;
    }
    async updateCardCategory(id, updates) {
        const {data} = await axios.patch(`${this.baseURL}/${id}`,updates)
        return data;
    }
    async deleteCardCategory(id) {
        await axios.delete(`${this.baseURL}/${id}`)
    }

}
const cardCategoryService = new CardCategoryService();
export default cardCategoryService;
