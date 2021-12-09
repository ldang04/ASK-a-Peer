import axios from 'axios'; 

const setAuthToken = token => {
    // Check if token exists, and add as request header
    if(token){
        axios.defaults.headers.common['x-auth-token'] = token; 
    } else {
        // Remove token if token is null
        delete axios.defaults.headers.common['x-auth-token'];
    }
}

export default setAuthToken; 