import types from './types';

export const setCountry = (data) => ({
    type: types.SET_COUNTRY,
    payload: data,
});
export const setCity = (data) => ({
    type: types.SET_CITY,
    payload: data,
});
export const setToken = (data) => ({
    type: types.SET_TOKEN,
    payload: data,
});
export const deleteToken = (data) => ({
    type: types.DELETE_TOKEN,
    payload: data,
});
export const setUser = (data) => ({
    type: types.SET_USER,
    payload: data,
});

export const signOut = (data) => ({
    type: types.SIGN_OUT,
    payload: data
});