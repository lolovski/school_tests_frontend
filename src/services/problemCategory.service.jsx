import axios from 'axios';

class ProblemCategoryService {
    baseURL = 'http://localhost:8000/problem_category';

    async getProblemCategories(parent_category_id = null) {
        const { data } = await axios.get(`${this.baseURL}/`, {
            params: {
                parent_category_id
            }
        });
        return data;
    }

    async getProblemCategory(id) {
        const { data } = await axios.get(`${this.baseURL}/${id}`);
        return data;
    }

    async createProblemCategory(data) {
        const response = await axios.post(this.baseURL, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    }

    async updateProblemCategory(id, updates) {
        const { data } = await axios.patch(`${this.baseURL}/${id}`, updates);
        return data;
    }

    async deleteProblemCategory(id) {
        await axios.delete(`${this.baseURL}/${id}`);
    }
}

const problemCategoryService = new ProblemCategoryService();
export default problemCategoryService;