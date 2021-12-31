import { 
    GET_SPACE,
    EDIT_SPACE,
    DELETE_SPACE, 
    SPACE_FAIL,
    TOGGLE_HELPFUL,
    SPACE_LOGOUT
} from '../actions/types';

const initialState = {
    space: null, 
    loading: true
}

const spaceReducer = (state = initialState, action) => {
    const { type, payload } = action; 
    switch(type){
        case GET_SPACE: 
            return {
                ...state, 
                space: payload,
                loading: false
            }
        case SPACE_FAIL: 
        case SPACE_LOGOUT:
            return {
                ...state,
                space: null, 
                loading: false
            }
        default: 
            return state
    } 
}

export default spaceReducer;