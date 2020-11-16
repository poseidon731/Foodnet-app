import types from './types';

const initialState = {
    country: 'en',
    city: '',
    logged: false,
    user: {
        token: null,
        email: '',
        city: '',
        cityStatus: false
    },
};

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case types.SET_COUNTRY:
            return {
                ...state,
                country: action.payload,
            };
        case types.SET_CITY:
            return {
                ...state,
                city: action.payload,
            };
        case types.SET_USER:
            return {
                ...state,
                logged: true,
                user: action.payload,
            };
        case types.DELETE_USER:
            return {
                ...state,
                logged: false,
                user: action.payload,
            };

            
        default:
            return state;
    }
}