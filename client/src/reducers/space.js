import { 
    GET_ALL_SPACES,
    GET_SPACE,
    DELETE_SPACE, 
    SPACE_FAIL,
    SPACE_LOGOUT,
    UPDATE_SPACE,
    CREATE_SPACE
} from '../actions/types';

const initialState = {
    spaces: [],
    space: null, 
    loading: true
}

const spaceReducer = (state = initialState, action) => {
    const { type, payload } = action; 
    switch(type){
        case GET_ALL_SPACES: 
        case CREATE_SPACE:
            return {
                ...state,
                spaces: payload,
                loading: false
            }
        case GET_SPACE: 
        case UPDATE_SPACE:
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