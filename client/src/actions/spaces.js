import axios from 'axios'; 
import { setAlert } from './alert';
import { 
    GET_SPACE, 
    SPACE_FAIL, 
    TOGGLE_HELPFUL
} from './types';

export const getSpace = (spaceId) => async dispatch => {
   try {
       const res = await axios.get(`/spaces/${spaceId}`); 
       dispatch({
           type: GET_SPACE,
           payload: res.data
       });
    } catch(err){
        console.log(err);
        dispatch({
            type: SPACE_FAIL
        });
    }   
}

export const toggleHelpful = (answerId, spaceId) => async dispatch => {
    try {
        const res = await axios.post(`/answers/${answerId}/vote`);
        dispatch(getSpace(spaceId));
    } catch(err){
        console.log(err);
        setAlert('Something went wrong. Refresh the page or try again later', 'danger');
    }
}