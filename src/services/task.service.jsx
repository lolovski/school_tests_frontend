import axios from 'axios';
import cardUserService from "./cardUser.service.jsx";


class TaskService {
    baseURL = 'http://localhost:8000/task';

    async getTasks(category_id = null) {
        const {data} = await axios.get(`${this.baseURL}/`,
            {
                params: {
                    category_id
                }
            }
        );
        return data;
    }

    async getTask(id) {
        const {data} = await axios.get(`${this.baseURL}/${id}`);
        return data;
    }
    async getCardTasks(card_id) {
        const { data } = await axios.get(`${this.baseURL}/card/`, {
            params: {
                card_id: card_id
            }
        });
        return data;
    }

    async createTask(data) {

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
    async updateTask(id, updates) {
        const {data} = await axios.patch(`${this.baseURL}/${id}`,updates)
        return data;
    }
    async deleteTask(id) {
        await axios.delete(`${this.baseURL}/${id}`)
    }
    async submitAnswers(cardId, userAnswers, userId) {
        await cardUserService.createCardUser({card_id: cardId, user_id: userId})
        for (const [taskId, userAnswer] of Object.entries(userAnswers)) {
            const data = {
                user_id: userId,
                card_id: cardId,
                task_id: taskId,
                user_answer: userAnswer
            };
            await axios.post(`http://localhost:8000/user_task/`, data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }
    }
}
const taskService = new TaskService();
export default taskService;
