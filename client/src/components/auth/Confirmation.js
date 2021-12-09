import './auth.css';
import React from 'react'; 
import { Link } from 'react-router-dom';

 
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
                                <p className="auth-text confirm-text">Congratulations! Your ASK-a-Peer account has been verified. Click <span><Link to="/auth/login">Login</Link></span> to get started.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Confirmation; 