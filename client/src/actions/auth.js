import axios from 'axios'; 
import { setAlert } from './alert';

import {
    REGISTER_FAIL, 
    LOGIN_SUCCESS,
    LOGIN_FAIL, 
    USER_LOADED, 
    AUTH_ERROR, 
    LOGOUT, 
    UPDATE_USER
} from './types'; 

import setAuthToken from '../utils/setAuthToken';
export const loadUser = () => async dispatch => {
    if(localStorage.token){ // if logged in, then should have token
        setAuthToken(localStorage.token); 
    }
    try {
        const res = await axios.get('/users/me');
         dispatch({
            type: USER_LOADED, 
            payload: res.data
         });
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        });
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
        const body = { email, password };

        try {
            const res = await axios.post('/auth/login', body, config); 
            localStorage.setItem('token', res.data.token)
            dispatch({
                type: LOGIN_SUCCESS, 
                payload: res.data.token
            });

            dispatch(loadUser());
        } catch(err){
            // Handle empty fields
            const errors = err.response.data.errors; 

            if(err.response.data.errors){
                errors.forEach(error => {
                    dispatch(setAlert(error.msg, 'danger'));
                });
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

//Update user 
export const updateUser = ({ avatar, bio, pronouns }) => async dispatch => {
    try {
         const config = {'Content-Type': 'application/json'}
         const body = {avatar, bio, pronouns}        
         // TODO: fix axios post request (not working ????)
        const res = await axios.post('/users/me', body, config);
         dispatch(setAlert('User Updated', 'success'));
         dispatch({
             type: UPDATE_USER,
             payload: res.data.user
         }); 
    } catch(err) { // TODO: Error handling post 
        dispatch(setAlert('Something went wrong. Refresh the page or try again later', 'danger'));
    }
 } 
 
