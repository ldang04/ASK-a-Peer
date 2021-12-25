import './layout.css';
import React, {useState, Fragment} from 'react'; 
import { Link, useLocation } from 'react-router-dom'; 
import { connect  } from 'react-redux';
import PropTypes from 'prop-types';

const Navbar = ({ auth: { isAuthenticated, loading, user }}) => {
    const [ toggled, setToggled ] = useState(false);
    const location = useLocation(); 

    const handleToggleClick = () => {
        setToggled(!toggled);
    };

    if(location.pathname === "/register" || location.pathname === "/login"){
        return (
            <Fragment />
        )
    }

    const dashboardLink = (
        <Fragment>
            { (location.pathnane !== '/dashboard') ? <Link to="/dashboard" className="nav-link inline-link d-inline-block dashboard-btn"><i class="fas fa-th"></i></Link> : <Fragment /> }
        </Fragment>
    )

    if(loading){
        return (
            <div className="navbar navbar-expand-md d-flex">
                <div className="container-fluid">
                    
                    <Link to="/" className="navbar-brand" >ASK-a-Peer</Link>
                    <button onClick={handleToggleClick} className={`navbar-toggler ${toggled ? "my-2" : ""}`} type="button" data-bs-toggle="collapse" data-bs-target=".collapse-nav" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <i className={`fas ${toggled ? "fa-times" : "fa-bars"} toggle-icon`}></i>
                    </button>          
                </div>
            </div>
        )
    }

    if(!loading && isAuthenticated){
        return (
            <div className="navbar navbar-expand-md d-flex">
            <div className="container-fluid"> 
                <Link to="/dashboard" className="navbar-brand" >ASK-a-Peer</Link>
                <button onClick={handleToggleClick} className={`navbar-toggler ${toggled ? "my-2" : ""}`} type="button" data-bs-toggle="collapse" data-bs-target=".collapse-nav" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <i className={`fas ${toggled ? "fa-times" : "fa-bars"} toggle-icon`}></i>
                </button>
                <div className="collapse navbar-collapse collapse-nav">
                    {/*Search bar*/}
                    {/*Ask a Question Button*/}
                </div>
                <div className="collapse navbar-collapse collapse-nav ml-auto to-right">
                    <li>
                        {dashboardLink}
                        <Link to="/me" className="nav-link inline-link profile-btn"><img src={user ? user.avatar : ''} className="pfp-img" alt="Profile Picture" />{user ? user.fullName : ''}</Link>
                    </li>
                </div>
            </div>
        </div>
        )
    }
    
    if(!loading){
        return (
            <div className="navbar navbar-expand-md d-flex">
                <div className="container-fluid">
                    
                    <Link to="/" className="navbar-brand" >ASK-a-Peer</Link>
                    <button onClick={handleToggleClick} className={`navbar-toggler ${toggled ? "my-2" : ""}`} type="button" data-bs-toggle="collapse" data-bs-target=".collapse-nav" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <i className={`fas ${toggled ? "fa-times" : "fa-bars"} toggle-icon`}></i>
                    </button>
                    <div className="collapse navbar-collapse collapse-nav">
                        {/*Search bar*/}
                        {/*Ask a Question Button*/}
                    </div>
                    <div className="collapse navbar-collapse collapse-nav ml-auto to-right">
                        <Link to="/register" className="nav-link">Register</Link>
                        <Link to="/login" className="nav-link">Login</Link>
                    </div>                
                </div>
            </div>
        )
    }
}

Navbar.propTypes = {
    auth: PropTypes.object.isRequired 
}

const mapStateToProps = state => ({
    auth: state.auth, 
}); 

export default connect(mapStateToProps)(Navbar); 