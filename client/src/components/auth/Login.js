import './auth.css';
import React from 'react'; 
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div className="login-page">
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
                                                        <input type="text" name="email" className="form-control" placeholder="Email" />
                                                    </div>
                                                    <div className="form-div">
                                                        <input type="password" name="password" className="form-control" placeholder="Password" />
                                                    </div>
                                                    <div className="form-div">
                                                        <button type="submit" className="form-control form-submit">L O G I N</button>
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
           </div>
        </div>
    )
}

export default Login; 