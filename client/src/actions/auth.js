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
        const res = await axios.post('/auth/register', body, config); 
        dispatch(setAlert(res.data.msg, 'success')); 
        
    } catch(err){
        console.log('from catch');
        console.log(err.response);
        
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