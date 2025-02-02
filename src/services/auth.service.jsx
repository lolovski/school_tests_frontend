import axios from 'axios';

class AuthService {
    baseURL = 'http://localhost:8000/auth';

    async register(values) {
        try {
            const response = await axios.post(
                `${this.baseURL}/register`,
                values,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }

    async login(values) {
        try {
            const response = await axios.post(
                `${this.baseURL}/jwt/login`,
                {
                    username: values.email,
                    password: values.password,
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }

    async signOut() {
        try {
            await axios.post(`${this.baseURL}/jwt/logout`, {}, { withCredentials: true });
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    }

    async getProfile() {
        try {
            const { data } = await axios.get('http://localhost:8000/users/me', { withCredentials: true });
            return data;
        } catch (error) {
            return error.response.data;
        }
    }

    async checkAuth() {
        try {
            const { data } = await axios.get('http://localhost:8000/authenticated-route', { withCredentials: true });
            return true;
        } catch (error) {
            if (error.response && error.response.status === 401) {

                return false;
            }
            throw error;
        }
    }
}

const authService = new AuthService();

export default authService;