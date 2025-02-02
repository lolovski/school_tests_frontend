import axios from 'axios';


class CardUserService {
    baseURL = 'http://localhost:8000/card_user';
    async getCardUsers(card_id) {
        const {data} = await axios.get(`${this.baseURL}/card/${card_id}`);
        return data;
    }
    async getUserCards(user_id) {
        const {data} = await axios.get(`${this.baseURL}/user/${user_id}`);
        return data;
    }
    async getFullUserCards(user_id) {
        const {data} = await axios.get(`http://localhost:8000/user_cards`,
            {
                params: {
                    user_id: user_id
                },
                withCredentials: true,
            });
        return data;
    }
    async getUserCard(user_id, card_id) {
        const {data} = await axios.get(`${this.baseURL}/?user_id=${user_id}&card_id=${card_id}`)

        return data;
    }

    async createCardUser(data) {

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

}
const cardUserService = new CardUserService();
export default cardUserService;
