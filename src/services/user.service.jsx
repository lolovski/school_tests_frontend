import axios from 'axios';


class UserService {
    baseURL = 'http://localhost:8000/users';

    async getMe() {
        const {data} = await axios.get(`${this.baseURL}/me`);
        return data;
    }

    async getUsers() {
        const {data} = await axios.get(`${this.baseURL}/`);
        return data;
    }
    async getStudents(){
        const {data} = await axios.get(`${this.baseURL}/students/`);
        return data;
    }

    async getUser(id) {
        const {data} = await axios.get(`${this.baseURL}/${id}`,
            {
            withCredentials: true,
                headers: {
                'Content-Type': 'application/json',
            }});
        return data;
    }
    async updateUser(id, updates) {
        const {data} = await axios.patch(`${this.baseURL}/${id}`,updates)
        return data;
    }
    async deleteUser(id) {
        await axios.delete(`${this.baseURL}/${id}`)
    }

}
const userService = new UserService();
export default userService;
