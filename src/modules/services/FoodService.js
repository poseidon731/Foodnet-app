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
    categories: function (country, restaurantName, searchedProduct) {
        return axios.post(`/products`, {
            lang: country,
            restaurantName,
            searchedProduct
        }).then((response) => {
            return response.data;
        });
    },
    products: function (country, categoryId, restaurantName, searchedProduct) {
        return axios.post(`/products/category`, {
            lang: country,
            categoryId,
            restaurantName,
            searchedProduct
        }).then((response) => {
            return response.data;
        });
    },
    allergen: function (country, productId, restaurantName) {
        return axios.post(`/products/allergen`, {
            lang: country,
            productId,
            restaurantName
        }).then((response) => {
            return response.data.result;
        });
    },
    information: function (country, restaurantName) {
        return axios.get(`/restaurant/info/${country}/${restaurantName}`).then((response) => {
            return response.data;
        });
    },
    reviews: function (restaurantName, rating) {
        return axios.post(`/restaurant/review`, {
            restaurantName,
            rating
        }).then((response) => {
            return response.data;
        });
    },
}

export default FoodService;