import axios from '@utils/axios';

const AuthService = {
    login: async function (email, password) {
        return await axios.post(`/auth/login`, {
            email,
            password
        }).then((response) => {
            return response.data;
        });
    },
    register: async function (name, email, password, newsletter) {
        return await axios.post(`/auth/register`, {
            email,
            name,
            password,
            newsletter
        }).then((response) => {
            return response.data;
        });
    },
    sendCode: async function (email) {
        return await axios.post(`/auth/reset-app`, {
            email
        }).then((response) => {
            return response.data;
        });
    },
    verification: async function (email) {
        return await axios.post(`/auth/verification/${email}`).then((response) => {
            return response.data;
        });
    },
}

export default AuthService;