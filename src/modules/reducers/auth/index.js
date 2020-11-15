import types from './types';

const initialState = {
    country: 'en',
    city: '',
    logged: false,
    token: null,
    user: {
        email: ''
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
        case types.SET_TOKEN:
            return {
                ...state,
                logged: true,
                token: action.payload,
            };
        case types.DELETE_TOKEN:
            return {
                ...state,
                logged: false,
                token: null,
            };
        case types.SET_USER:
            return {
                ...state,
                user: action.payload,
            };
            
        case types.SIGN_OUT:
            return {
                ...state,
                logged: false,
                user: initialState
            };
        default:
            return state;
    }
}