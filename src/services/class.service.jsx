import axios from 'axios';


class ClassService {
    baseURL = 'http://localhost:8000/class';

    async getClasses(school_id) {
        const {data} = await axios.get(`${this.baseURL}es/${school_id}`);
        return data;
    }

    async getClass(id) {
        const {data} = await axios.get(`${this.baseURL}/${id}`);
        return data;
    }

    async createClass(data) {

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
    async updateClass(id, updates) {
        const {data} = await axios.patch(`${this.baseURL}/${id}`,updates)
        return data;
    }
    async deleteClass(id) {
        await axios.delete(`${this.baseURL}/${id}`)
    }

    async getSheduleSystems(school_id){
        const {response} = await axios.get(
            'http://localhost:8000/school/schedule_system',
            {
                params: {school_id},
                withCredentials: true,
            }
            )
        return response;
    }
}
const classService = new ClassService();
export default classService;
