import './auth.css';
import React, { useState, useEffect } from 'react'; 
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import { removeHeader } from '../../actions/header';

import Alert from '../layout/Alert';
 
const Login = ({ login, removeHeader, isAuthenticated }) => {

    useEffect(() => {
        removeHeader();
    }, []); 
    
    const [formData, setFormData] = useState({
        email: '', 
        password: ''
    }); 

    const { email, password } = formData; 

    const onInputChange = e => setFormData({...formData, [e.target.name]: e.target.value}); 

    const onFormSubmit = e => {
        e.preventDefault();
        login(email, password);
    }

    // Redirect if logged in 
    if(isAuthenticated){
        return <Redirect to="/" />
    }

    return (
        <div className="login-page">
            <div className="container">
                <div className="row">
                        <div className="col-8 auth-card p-0">
                                <div className="content-wrapper align-items-center">
                                    <div className="d-none d-lg-inline-flex col-lg-6 samphil-img">
                    
                                    </div>
                                    <div className="col-12 col-lg-6">
                                         <div className="form-container">
                                            <h1 className="auth-title">ASK-a-Peer</h1>
                                                <Alert />
                                                <form onSubmit={onFormSubmit}>
                                                    <div className="form-div">
                                                        <input 
                                                            type="email" 
                                                            name="email" 
                                                            value={email}
                                                            className="form-control" 
                                                            placeholder="Email" 
                                                            onChange={e => onInputChange(e)} />
                                                    </div>
                                                    <div className="form-div-mod">
                                                        <input 
                                                            type="password" 
                                                            name="password" 
                                                            value={password}
                                                            className="form-control" 
                                                            placeholder="Password" 
                                                            onChange={e => onInputChange(e)} />
                                                    </div>
                                                    {/* TODO: Complete password reset */}
                                                    <div className="form-text mb-4"><Link to="/auth/register">Forgot your password?</Link></div> 
                                                    <div className="form-div">
                                                        <button type="submit" className="form-control auth-button">L O G I N</button>
                                                    </div>
                                                    </form>
                                                    <p className="form-subtext"> Don't have an account? <Link to="/auth/register"><span className="form-subtext-link">Register</span></Link></p>
                                            </div>
                                    </div>
                                </div>
                        </div>
                </div>
           </div>
        </div>
    )
}

const mapStateToProps = state => ({
   isAuthenticated: state.auth.isAuthenticated
});

Login.propTypes = {
    login: PropTypes.func.isRequired, 
    isAuthenticated: PropTypes.bool
}
export default connect(mapStateToProps, { login, removeHeader })(Login);