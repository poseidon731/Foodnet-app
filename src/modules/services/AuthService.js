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
    verification: async function (email) {
        return await axios.post(`/auth/verification`, {
            email
        }).then((response) => {
            return response.data;
        });
    },
    reset: async function (email, password, code) {
        return await axios.post(`/auth/reset-password-app`, {
            email,
            newPassword: password,
            code
        }).then((response) => {
            return response.data;
        });
    },
    cities: async function (country) {
        return await axios.get(`/location-app/${country}`).then((response) => {
            return response.data;
        });
    },
}

export default AuthService;