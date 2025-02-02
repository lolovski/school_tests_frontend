import axios from 'axios';


class StudentService {
    baseURL = 'http://localhost:8000/card';

    async getStudentsByCard(card_id = null) {
        const {data} = await axios.get(`${this.baseURL}_users`,
            {
                params: {
                    card_id
                },
                withCredentials: true
            }
        );
        return data;
    }
    async getCardsByName(name) {
        const {data} = await axios.get(`${this.baseURL}_by_name`,
            {
                params: {
                    name
                },
                withCredentials: true
            }
        );
        return data;
    }

}
const studentService = new StudentService();
export default studentService;
