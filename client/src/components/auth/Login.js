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
                                <div className="row align-items-center">
                                    <div className="d-none d-lg-inline-flex col-lg-6 samphil-img">
                                    </div>
                                    <div className="col-12 col-lg-6">
                                         <div className="form-container">
                                            <h1 className="auth-title">ASK-a-Peer</h1>
                                                <form>
                                                    <div className="form-div">
                                                        <input 
                                                            type="email" 
                                                            name="email" 
                                                            value="email" 
                                                            className="form-control" 
                                                            placeholder="Email" 
                                                            required
                                                        />
                                                    </div>
                                                    <div className="form-div">
                                                        <input 
                                                            type="password" 
                                                            name="password" 
                                                            value="password" 
                                                            className="form-control" 
                                                            placeholder="Password" 
                                                            required
                                                            />
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
    )
}

export default Login; 