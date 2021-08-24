import './auth.css';
import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';

const Register = () => {
    const [formDate, setFormData] = useState(); 
    
    return (
        <div className="register-page">
            <div className="container">
                <div className="row">
                        <div className="col-8 auth-card">
                            <div className="card border-0">
                                <div className="row">
                                    <div className="d-none d-lg-inline-block col-lg-6 samphil-img">
                                    </div>
                                    <div className="col-12 col-lg-6 form-col" >
                                        <div className="form-middle">
                                            <div className="form-container">
                                                <h1 className="auth-title">ASK-a-Peer</h1>
                                                <form>
                                                    <div className="form-div">
                                                        <input type="text" name="fullName" className="form-control" placeholder="Full Name" />
                                                    </div>
                                                    <div className="form-div">
                                                        <input type="email" name="email" className="form-control" placeholder="Email" />
                                                        <div className="form-text">Please enter a valid email ending in @andover.edu</div>
                                                    </div>
                                                    <div className="form-div">
                                                        <input type="password" name="password" className="form-control" placeholder="Password" />
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
           </div>
        </div>
    )
}

export default Register;