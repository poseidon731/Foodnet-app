import axios from '@utils/axios';

const FoodService = {
    featured: async function (country, cityName) {
        return axios.get(`/location-app/promotion/${country}/${cityName}`).then((response) => {
            return response.data;
        });
    },
    trendy: async function (country, cityName) {
        return axios.get(`/location-app/popular/${country}/${cityName}`).then((response) => {
            return response.data;
        });
    },
    result: async function (country, cityName) {
        return axios.get(`/location-app/${country}/${cityName}`).then((response) => {
            return response.data;
        });
    },
}

export default FoodService;