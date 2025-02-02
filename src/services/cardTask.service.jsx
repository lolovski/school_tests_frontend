import axios from 'axios';


class CardTaskService {
    baseURL = 'http://localhost:8000/card_task';
    async getCardTasks(card_id) {
        const {data} = await axios.get(`${this.baseURL}/${card_id}`);
        return data;
    }

    async createCardTask(data) {

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
    async deleteCardTask(cardId, taskId) {
        await axios.delete(`${this.baseURL}/?card_id=${cardId}&task_id=${taskId}`, {
            withCredentials: true,
        });
    }
    async updateCardTask(id, updates) {
        const {data} = await axios.patch(`${this.baseURL}/${id}`, updates, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return data;
    }
    async getTasksByCard(id){
        const {data} = await axios.get(`${this.baseURL}/?card_id=${id}`);
        return data;
    }

}
const cardTaskService = new CardTaskService();
export default cardTaskService;
