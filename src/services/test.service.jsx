// src/services/test.service.jsx
import axios from 'axios';

class TestService {
    baseURL = 'http://localhost:8000/test';

    async getTests(problemId=null) {
        let s = this.baseURL
        if (problemId) {
            s += `?problem_id=${problemId}`
        }
        const { data } = await axios.get(s);
        return data;
    }

    async getTest(id) {
        const { data } = await axios.get(`${this.baseURL}/${id}`);
        return data;
    }

    async createTest(data) {
        const response = await axios.post(this.baseURL, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    }

    async updateTest(id, updates) {
        const { data } = await axios.patch(`${this.baseURL}/${id}`, updates
        );
        return data;
    }

    async deleteTest(id) {
        await axios.delete(`${this.baseURL}/${id}`);
    }
}

const testService = new TestService();
export default testService;