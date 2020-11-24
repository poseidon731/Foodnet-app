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
    categories: function (country, categoryId, restaurantName, searchedProduct) {
        country = 'ro';
        categoryId = '';
        restaurantName = 'Mama Mia Pizza';
        searchedProduct = '';
        return axios.post(`/products/category`, {
            lang: country,
            categoryId,
            restaurantName,
            searchedProduct
        }).then((response) => {
            return response.data;
        });
    },
    information: function (country, restaurantName) {
        return axios.get(`/restaurant/info/${country}/${restaurantName}`).then((response) => {
            return response.data;
        });
    },
    reviews: function (restaurantName, rating) {
        // restaurantName = 'Mama Mia Pizza';
        // rating = 0;
        console.log(restaurantName, rating)
        return axios.post(`/restaurant/review`, {
            restaurantName,
            rating
        }).then((response) => {
            return response.data;
        });
    },
}

export default FoodService;