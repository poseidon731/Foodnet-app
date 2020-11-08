import types from './types';

const initialState = {
    logged: false,
    token: null,
    user: null
};

export default function authReducer(state = initialState, action) {
    switch (action.type) {
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
                user: null
            };

        case types.SET_USER:
            return {
                ...state,
                // logged: true,
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