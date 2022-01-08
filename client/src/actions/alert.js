import uuid from 'uuid'; 
import { 
    SET_ALERT, 
    REMOVE_ALERT,
    SET_FORM_ALERT,
    REMOVE_FORM_ALERT
} from "./types";

export const setAlert = (msg, alertType, timeout = 7000) => dispatch => {
    const id = uuid.v4();

    dispatch({
        type: SET_ALERT, 
        payload: { msg, alertType, id}
    }); 

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id}), timeout);
}

export const setFormAlert = (msg, alertType, timeout = 7000) => dispatch => {
    const id = uuid.v4();

    dispatch({
        type: SET_FORM_ALERT,
        payload: { msg, alertType, id}
    });
    setTimeout(() => dispatch({ type: REMOVE_FORM_ALERT, payload: id}), timeout);
}