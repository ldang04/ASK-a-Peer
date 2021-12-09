import axios from 'axios'; 

const setAuthToken = token => {
    console.log('from set Authtoken.js');
    console.log(token);
    // Check if token exists, and add as request header
    if(token){
        axios.defaults.headers.common['x-auth-token'] = token; 
    } else {
        // Remove token if token is null
        delete axios.defaults.headers.common['x-auth-token'];
    }
}

export default setAuthToken; 