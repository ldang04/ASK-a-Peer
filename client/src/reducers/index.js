import { combineReducers } from 'redux'; 
import alert from './alert'; 
import auth from './auth';
import space from './space';

export default combineReducers({
    alert, 
    auth,
    space
});