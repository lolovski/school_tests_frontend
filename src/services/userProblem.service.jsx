// src/services/userProblem.service.jsx
import axios from 'axios';

class UserProblemService {
    baseURL = 'http://localhost:8000/user_problem';

    async getUserProblems(user_id = null, problem_id = null) {
        let url = this.baseURL;
        if (user_id !== null) {
            url += `?user_id=${user_id}`;
        }
        if (problem_id !== null) {
            url += user_id !== null ? `&problem_id=${problem_id}` : `?problem_id=${problem_id}`;
        }

        const { data } = await axios.get(url);
        return data;
    }

    async createUserProblem(data) {
        const response = await axios.post(this.baseURL, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    }

    async deleteUserProblem(user_id, problem_id) {
        await axios.delete(`${this.baseURL}?user_id=${user_id}&problem_id=${problem_id}`);
    }
}

const userProblemService = new UserProblemService();
export default userProblemService;