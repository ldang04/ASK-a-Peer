import { combineReducers } from 'redux'; 
import alert from './alert'; 
import auth from './auth';
import space from './space';
import formAlert from './formAlert';

export default combineReducers({
    alert, 
    formAlert,
    auth,
    space
});