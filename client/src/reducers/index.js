import { combineReducers } from 'redux'; 
import alert from './alert'; 
import auth from './auth';
import header from './header'; 


export default combineReducers({
    alert, 
    auth, 
    header
});