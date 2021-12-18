import { 
    REMOVE_HEADER, 
    SHOW_HEADER
} from '../actions/types'; 

const initialState = {
    removeHeader: null
}

export default function(state = initialState, action){
    const { type, payload } = action; 
    switch (type){
        case REMOVE_HEADER: 
            return {
                ... state, 
                removeHeader: true
            }
        case SHOW_HEADER: 
        return {
            ... state, 
            removeHeader: false
        }
        default: 
            return {
                state
            }
    }
}