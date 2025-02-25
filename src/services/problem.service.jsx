// src/services/problem.service.jsx
import axios from 'axios';

class ProblemService {
    baseURL = 'http://localhost:8000/problem';

    async getProblems(category_id=null) {
        const { data } = await axios.get(`${this.baseURL}/`,
            {
                params: {
                    category_id
                },
                withCredentials: true
            }
        );
        return data;
    }

    async getProblem(id) {
        const { data } = await axios.get(`${this.baseURL}/${id}`);
        return data;
    }

    async createProblem(data) {
        const response = await axios.post(this.baseURL, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        });

        return response.data;
    }

    async updateProblem(id, updates) {
        const { data } = await axios.patch(`${this.baseURL}/${id}`, updates);
        return data;
    }

    async deleteProblem(id) {
        await axios.delete(`${this.baseURL}/${id}`);
    }
}

const problemService = new ProblemService();
export default problemService;