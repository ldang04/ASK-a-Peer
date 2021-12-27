import {
    REGISTER_FAIL,
    LOGIN_SUCCESS, 
    LOGIN_FAIL, 
    USER_LOADED, 
    AUTH_ERROR, 
    LOGOUT, 
    UPDATE_USER
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'), 
    isAuthenticated: null,
    loading: true, 
    user: null, 
}

const authReducer = (state = initialState, action) => {
    const { type, payload } = action; 
    switch(type) {
        case USER_LOADED:
        return {
            ...state,
            user: payload,
            isAuthenticated: true,
            loading: false,
        }
        case UPDATE_USER:
            return {
                ...state,
                user: {
                    ...state.user,
                    pronouns: payload.pronouns,
                    bio: payload.bio,
                    avatar: payload.avatar
                }, 
                isAuthenticated: true,
                loading: false
            }
        case LOGIN_SUCCESS: 
            localStorage.setItem('token', payload);
            return {
                ...state, 
                token: payload,
                isAuthenticated: true, 
                loading: false, 
            };
        case REGISTER_FAIL: 
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
            localStorage.removeItem('token'); 
            return {
                ...state, 
                token: null, 
                isAuthenticated: false, 
                loading: false, 
            };
        default: 
            return state;
    }
}

export default authReducer; 