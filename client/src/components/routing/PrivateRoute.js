import React from 'react'; 
import { Redirect } from 'react-router-dom'; 
import { connect } from 'react-redux'; 

// Private route checks for authentication, and redirects to login page if not authenticated. 
const PrivateRoute = ({ 
    component: Component, 
    auth: {isAuthenticated, loading}
}) => {
    // if(loading) return <div>Loading...</div>
    // if(!isAuthenticated && !loading) return <Redirect to="/login"  />
    // return <Component />
    
    if (loading) return <div>Loading...</div>; 
    if(isAuthenticated) return <Component />
    return <Redirect to="/login" />
}

const mapStateToProps = state => ({
    auth: state.auth 
}); 

export default connect(mapStateToProps)(PrivateRoute);