import axios from '@utils/axios';

const AuthService = {
    login: async function (email, password) {
        return await axios.post(`/auth/login`, {
            email,
            password
        }).then((response) => {
            console.log(response);
            // return response.data;
        });
    },
}

export default AuthService;