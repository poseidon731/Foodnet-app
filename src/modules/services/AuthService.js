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
}

export default AuthService;