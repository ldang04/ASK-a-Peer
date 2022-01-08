import { 
    SET_FORM_ALERT,
    REMOVE_FORM_ALERT
} from '../actions/types';
const initialState = []

export default alert = (state = initialState, action) => {
    const { type, payload } = action;
    switch(type){
        case SET_FORM_ALERT: 
            return [...state, payload]
        case REMOVE_FORM_ALERT: 
            return state.filter(alert => alert.id !== payload); 
         default: 
            return state;
    }
}