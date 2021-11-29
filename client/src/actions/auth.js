import axios from 'axios'; 
import { setAlert } from './alert';

import {
    REGISTER_SUCCESS, 
    REGISTER_FAIL
} from './types'; 

// Register User
export const register = ({ fullName, email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ fullName, email, password }); 

    try {
        const res = await axios.post('/auth/register', body, config)
        
        dispatch({
            type: REGISTER_SUCCESS, 
            payload: res.data
        }, setAlert(res.data.msg, 'success')); 

    } catch(err){
        const errors = err.response.data.errors; 

        if(errors){
            errors.forEach(error => {
                dispatch(setAlert(error.msg, 'danger'));
            });
            console.log(errors);
        }

        dispatch({
            type: REGISTER_FAIL
        });
    }
}