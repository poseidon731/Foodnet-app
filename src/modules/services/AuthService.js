import axios from '@utils/axios';

const AuthService = {
    login: function (email, password) {
        return axios.post(`/auth/login`, {
            email,
            password
        }).then((response) => {
            return response.data;
        });
    },
    register: function (name, email, password, newsletter) {
        return axios.post(`/auth/register`, {
            email,
            name,
            password,
            newsletter
        }).then((response) => {
            return response.data;
        });
    },
    verification: function (email) {
        return axios.post(`/auth/verification`, {
            email
        }).then((response) => {
            return response.data;
        });
    },
    reset: function (email, password, code) {
        return axios.post(`/auth/reset-password-app`, {
            email,
            newPassword: password,
            code
        }).then((response) => {
            return response.data;
        });
    },
    cities: function (country) {
        return axios.get(`/location-app/${country}`).then((response) => {
            return response.data;
        });
    },
}

export default AuthService;