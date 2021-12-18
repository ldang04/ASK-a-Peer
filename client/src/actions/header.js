import { 
    REMOVE_HEADER, 
    SHOW_HEADER
} from './types';

// Remove navbar 
export const removeHeader = () => dispatch => {
    dispatch({type: REMOVE_HEADER }); 
}

export const showHeader = () => dispatch => {
    dispatch({type: SHOW_HEADER}); 
}