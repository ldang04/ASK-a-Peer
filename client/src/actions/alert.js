import uuid from 'uuid'; 
import { SET_ALERT, REMOVE_ALERT } from "./types";

export const setAlert = (msg, alertType, timeout = 7000) => dispatch => {
    const id = uuid.v4();
    console.log('coming from alert.js');
    console.log(msg);
    dispatch({
        type: SET_ALERT, 
        payload: { msg, alertType, id}
    }); 

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id}), timeout);
}