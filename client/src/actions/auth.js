import axios from 'axios'; 
import { setAlert } from './alert';

import {
    REGISTER_FAIL, 
    LOGIN_SUCCESS,
    LOGIN_FAIL, 
    USER_LOADED, 
    AUTH_ERROR, 
    LOGOUT, 
} from './types'; 

import setAuthToken from '../utils/setAuthToken';
export const loadUser = () => async dispatch => {
    // Set global auth token 
    if(localStorage.token){ // if logged in, then should have token
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get('/users/me');
         console.log(res);
         dispatch({
            type: USER_LOADED, 
            payload: res.data
         });
       
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}

// Register User
export const register = ({ fullName, email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    // Validate Andover Email 
    if(email){
        const domain = email.split('@')[1]; 
        if(domain.replace(/\s/g, "") !== 'andover.edu'){
        return dispatch(setAlert('Please enter an email ending with @andover.edu', 'danger'));
    } 
    }
      const body = JSON.stringify({ fullName, email, password });

        try {
            const res = await axios.post('/auth/register', body, config); 
            dispatch(setAlert(res.data.msg, 'success')); 
            dispatch(loadUser());
        } catch(err){
            // Handle empty fields
            const errors = err.response.data.errors; 

            if(errors){
                errors.forEach(error => {
                    dispatch(setAlert(error.msg, 'danger'));
                });
                console.log(errors);
            }
            // Handle repeat user 
            const error = err.response.data.error; 
            if(error){
                dispatch(setAlert(error, 'danger'));
            }

            dispatch({
                type: REGISTER_FAIL
            });
    }

}

// Login User
export const login = ( email, password ) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
        const body = JSON.stringify({ email, password });

        try {
            const res = await axios.post('/auth/login', body, config); 
            dispatch({
                type: LOGIN_SUCCESS, 
                payload: res.data.token
            });
            // dispatch(loadUser());
        } catch(err){
            // Handle empty fields
            const errors = err.response.data.errors; 

            if(errors){
                errors.forEach(error => {
                    dispatch(setAlert(error.msg, 'danger'));
                });
                console.log(errors);
            }
            // Handle repeat user 
            const error = err.response.data.error; 
            if(error){
                dispatch(setAlert(error, 'danger'));
            }

            dispatch({
                type: LOGIN_FAIL
            });
    }

}; 

// Logout action / clear profile

export const logout = () => dispatch => {
    dispatch({ type: LOGOUT }); 
}

