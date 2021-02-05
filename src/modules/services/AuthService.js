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
    register: function (country, name, email, mobile, password, newsletter) {
        return axios.post(`/auth/register`, {
            lang: country,
            email,
            name,
            mobile,
            password,
            newsletter
        }).then((response) => {
            return response.data;
        });
    },
    verification: function (email, country) {
        return axios.post(`/auth/verification`, {
            email,
            lang: country
        }).then((response) => {
            return response.data;
        });
    },
    reset: function (email, password, code, country) {
        return axios.post(`/auth/change-password`, {
            email,
            newPassword: password,
            code,
            lang: country
        }).then((response) => {
            return response.data;
        });
    },
    cities: function (country) {
        return axios.get(`/location/${country}`).then((response) => {
            return response.data;
        });
    },
    citiesRes: function (country) {
        return axios.get(`/location/${country}/cities`).then((response) => {
            return response.data;
        });
    },
    cityNames: function (cityId) {
        return axios.get(`/location/base/city-name/${cityId}`).then((response) => {
            return response.data;
        });
    },
}

export default AuthService;