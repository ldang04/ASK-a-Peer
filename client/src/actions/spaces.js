import axios from 'axios'; 
import { setAlert } from './alert';
import { 
    GET_SPACE, 
    SPACE_FAIL, 
    UPDATE_SPACE,
    GET_ALL_SPACES,
    CREATE_SPACE
} from './types';

export const getAllSpaces = () => async dispatch => {
    try {
        const res = await axios.get('/spaces'); 
        let spaceArr = [];
        res.data.forEach(space => {
            let spaceObject = {}; 
            spaceObject.title = space.title; 
            spaceObject.link = `/spaces/${space._id}`;

            spaceArr.push(spaceObject);
        });

        // Sort spaces alphabetically 
        // Method source: https://stackoverflow.com/questions/6712034/sort-array-by-firstname-alphabetically-in-javascript/18493652
        let sortedSpaces = spaceArr.sort((a, b) => {
            if(a.title < b.title) return -1; 
            if(a.title > b.title ) return 1;
            return 
        });
        
        dispatch({
            type: GET_ALL_SPACES,
            payload: sortedSpaces
        });
    } catch {
        setAlert('Something went wrong. Refresh the page or try again later', 'danger');
    }
}

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

export const updateSpace = (spaceId, data) => async dispatch => {
    const config = {headers: {'Content-Type': 'application/json'}}
    try {
        let body = {}
        body.title = data.title; 

        let inputMods = data.moderators.replace(/\s+/g, '').split(',');
        body.moderators = inputMods; 
    
        let inputAdmins = data.admins.replace(/\s+/g, '').split(',');
        body.admins = inputAdmins; 
    
        const res = await axios.post(`/spaces/${spaceId}`, body, config);

        dispatch({
            type: UPDATE_SPACE,
            payload: res.data.space
        });
        
        dispatch(setAlert('Space successfully updated', 'success'));
    } catch(err){
        console.log(err);
        dispatch(setAlert('Something went wrong. Refresh the page or try again later', 'danger'));
    }
}

export const createSpace = (data) => async dispatch => {
    try {
        const config = { 'Content-Type': 'application/json'};
        const res = await axios.post('/spaces', data, config);

        dispatch({
            type: CREATE_SPACE,
            payload: res.data
        });
    
        // Remove create modal
        document.getElementById("edit-spacelist-modal").classList.remove("show", "d-block");
        document.querySelectorAll(".modal-backdrop").forEach(el => el.classList.remove("modal-backdrop"))
    } catch(err){
        console.log(err);
        if(err.response){
            return dispatch(setAlert(err.response.data.error, 'danger'));
        }
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