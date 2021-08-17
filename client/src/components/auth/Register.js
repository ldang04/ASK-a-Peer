import './login.css';
import samphil from '../../assets/auth-samphil.jpeg';
import React from 'react'; 
import { red } from 'color-name';

const Register = () => {
    return (
        <div className="register-page">
            <div className="container">
                <div className="row">
                        <div className="col-8 auth-card">
                            <div className="card border-0">
                                <div className="row">
                                    <div className="d-none d-lg-inline-block col-lg-6 samphil-img">
                                    </div>
                                    <div className="col-12 col-lg-6">
                                        <div className="form-container">
                                            <h1 className="auth-title">ASK-a-Peer</h1>
                                            <form>
                                                
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
           </div>
        </div>
    )
}

export default Register;