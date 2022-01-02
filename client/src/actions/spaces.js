import axios from 'axios'; 
import { setAlert } from './alert';
import { 
    GET_SPACE, 
    SPACE_FAIL, 
    UPDATE_SPACE
} from './types';

export const getSpace = (spaceId) => async dispatch => {
   try {
       const res = await axios.get(`/spaces/${spaceId}`); 
       dispatch({
           type: GET_SPACE,
           payload: res.data
       });
    } catch(err){
        dispatch({
            type: SPACE_FAIL
        });
    }   
}

export const updateSpace = (spaceId, data, space) => async dispatch => {
    const config = {headers: {'Content-Type': 'application/json'}}
    try {
        let body = {title: space.title, admins: space.admins, moderators: space.moderators};

        if(data.title) body.title = data.title; 

        if(data.moderators){
            let inputMods = data.moderators.replace(/\s+/g, '').split(',');
            body.moderators = inputMods; 
        }

        if(data.admins){
            let inputAdmins = data.admins.replace(/\s+/g, '').split(',');
            body.admins = inputAdmins; 
        }
        
        const res = await axios.post(`/spaces/${spaceId}`, body, config);
        console.log('RES.DATA');
        console.log(res.data.space);

        dispatch({
            type: UPDATE_SPACE,
            payload: res.data.space
        });
        
    } catch(err){
        dispatch(setAlert('Something went wrong. Refresh the page or try again later', 'danger'));
    }
}


export const toggleHelpful = (answerId, spaceId) => async dispatch => {
    try {
        const res = await axios.post(`/answers/${answerId}/vote`);
        dispatch(getSpace(spaceId));
    } catch(err){
        console.log(err);
        dispatch(setAlert('Something went wrong. Refresh the page or try again later', 'danger'));
    }
}