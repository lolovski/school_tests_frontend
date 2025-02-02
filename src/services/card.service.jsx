import axios from 'axios';


class CardService {
    baseURL = 'http://localhost:8000/card';

    async getCards(category_id = null) {
        const {data} = await axios.get(`${this.baseURL}/`,
            {
                params: {
                    category_id
                },
                withCredentials: true
            }
        );
        return data;
    }

    async getCard(id) {
        const {data} = await axios.get(`${this.baseURL}/${id}`);
        return data;
    }

    async createCard(data) {
        const response = await axios.post(this.baseURL, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    }
    async updateCard(id, updates) {
        const {data} = await axios.patch(`${this.baseURL}/${id}`,updates)
        return data;
    }
    async deleteCard(id) {
        await axios.delete(`${this.baseURL}/${id}`)
    }
}
const cardService = new CardService();
export default cardService;
