import axios from 'axios';


class TaskCategoryService {
    baseURL = 'http://localhost:8000/task_category';

    async getTaskCategories(parent_category_id = null) {
        const {data} = await axios.get(`${this.baseURL}/`,
            {
                params: {
                    parent_category_id
                }
            }
         );
        return data;
    }

    async getTaskCategory(id) {
        const {data} = await axios.get(`${this.baseURL}/${id}`);
        return data;
    }

    async createTaskCategory(data) {

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
    async updateTaskCategory(id, updates) {
        const {data} = await axios.patch(`${this.baseURL}/${id}`,updates)
        return data;
    }
    async deleteTaskCategory(id) {
        await axios.delete(`${this.baseURL}/${id}`)
    }

}
const taskCategoryService = new TaskCategoryService();
export default taskCategoryService;
