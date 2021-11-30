import './auth.css';
import React, { useState } from 'react'; 
// import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { setAlert } from '../../actions/alert';
// import PropTypes from 'prop-types';
// import image from '../../assets/auth-samphil.jpeg';

// import Alert from '../layout/Alert';
 
const Confirmation = () => {
    return(
        <div className="confirmation-page">
            <div className="container">
                <div className="row">
                    <div className="col-8 confirm-card">
                        <div className="content-wrapper">
                            {/* <div className="col-0 col-lg-6 confirm-img">
                            </div> */}
                            <div className="col-12 p-5">
                                <h1 className="auth-title mb-4">Email Confirmed <i class="fas fa-check-circle"></i></h1>
                                <p className="auth-text">Congratulations! You are now a member of ASK-a-Peer! Click the link below to get started.</p>
                                <p className="auth-text"><a href="/users/me">Login</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Confirmation; 