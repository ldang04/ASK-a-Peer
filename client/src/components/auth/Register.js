import './auth.css';
import React, { useState } from 'react'; 
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';
import image from '../../assets/auth-samphil.jpeg';

import Alert from '../layout/Alert';
 
const Register = ({ setAlert, register}) => {
    const [formData, setFormData] = useState({
        fullName: '', 
        email: '', 
        password: ''
    }); 

    const { fullName, email, password } = formData; 

    const onInputChange = e => setFormData({...formData, [e.target.name]: e.target.value}); 

    const onFormSubmit = e => {
        e.preventDefault();
        const body = {fullName, email, password}; 
        try {
            register({ fullName, email, password});
        } catch(err){
            console.log(err);
        }
    }

    return (
        <div className="register-page">
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
                                                <form onSubmit={e => onFormSubmit(e)}>
                                                    <div className="form-div">
                                                        <input 
                                                            type="text" 
                                                            name="fullName" 
                                                            value={fullName} 
                                                            className="form-control" 
                                                            placeholder="Full Name" 
                                                            onChange={e => onInputChange(e)} />
                                                    </div>
                                                    <div className="form-div">
                                                        <input 
                                                            type="email" 
                                                            name="email" 
                                                            value={email}
                                                            className="form-control" 
                                                            placeholder="Email" 
                                                            onChange={e => onInputChange(e)} />
                                                        <div className="form-text">Please enter a valid email ending in @andover.edu</div>
                                                    </div>
                                                    <div className="form-div">
                                                        <input 
                                                            type="password" 
                                                            name="password" 
                                                            value={password}
                                                            className="form-control" 
                                                            placeholder="Password" 
                                                            onChange={e => onInputChange(e)} />
                                                    </div>
                                                    <div className="form-div">
                                                        <button type="submit" className="form-control form-submit">R E G I S T E R</button>
                                                    </div>
                                                    </form>
                                                    <p className="form-subtext"> Already have an account? <Link to="/auth/login"><span className="form-subtext-link">Login</span></Link></p>
                                            </div>
                                    </div>
                                </div>
                        </div>
                </div>
           </div>
        </div>
    )
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired, 
    register: PropTypes.func.isRequired
}

export default connect(null, { setAlert, register })(Register);