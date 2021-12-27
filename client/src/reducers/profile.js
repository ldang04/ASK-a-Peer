import {
   UPDATE_PROFILE, 
   GET_PROFILE
} from '../actions/types';

const initialState = {
    profile: null,
    loading: true
}

const profileReducer = (state = initialState, action) => {
    const { type, payload } = action; 
    switch(type){
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false
            }
        default: 
            return state
    }
}

export default profileReducer;