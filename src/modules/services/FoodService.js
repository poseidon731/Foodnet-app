import axios from '@utils/axios';

const FoodService = {
    featured: function (country, cityName) {
        return axios.get(`/location-app/promotion/${country}/${cityName}`).then((response) => {
            return response.data;
        });
    },
    trendy: function (country, cityName) {
        return axios.get(`/location-app/popular/${country}/${cityName}`).then((response) => {
            return response.data;
        });
    },
    result: function (country, cityName, search, filters) {
        return axios.post(`/location-app/search`, {
            lang: country,
            location: cityName,
            searchString: search,
            filters
        }).then((response) => {
            return response.data;
        });
    },
}

export default FoodService;