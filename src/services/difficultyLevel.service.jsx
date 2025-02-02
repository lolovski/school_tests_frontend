import axios from 'axios';

class DifficultyLevelService {
    baseURL = 'http://localhost:8000/difficulty_level';
    async createDifficultyLevel(data) {
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
    async getDifficultyLevels() {
        const {data} = await axios.get(`${this.baseURL}/`);
        return data;
    }
    async getDifficultyLevel(id) {
        const {data} = await axios.get(`${this.baseURL}/${id}`);
        return data;
    }
    async updateDifficultyLevel(id, updates) {
        const {data} = await axios.patch(`${this.baseURL}/${id}`,updates)
        return data;
    }
    async deleteDifficultyLevel(id) {
        await axios.delete(`${this.baseURL}/${id}`)
    }
}
const difficultyLevelService = new DifficultyLevelService();
export default difficultyLevelService;