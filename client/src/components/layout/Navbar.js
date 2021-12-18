import './layout.css';
import React, {useState, Fragment, useEffect} from 'react'; 
import { Link } from 'react-router-dom'; 
import { connect  } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth'; 

const Navbar = ({ auth: { isAuthenticated, loading }, removeHeader, logout }) => {

    const authLinks = (
        <div className="collapse navbar-collapse collapse-nav ml-auto to-right">
                <li>
                    <a onClick={logout} href="#!" className="nav-link logout-link">Logout</a>
                </li>
            </div>
    )
    const guestLinks = (
        <div className="collapse navbar-collapse collapse-nav ml-auto to-right">
                    <Link to="/register" className="nav-link">Register</Link>
                    <Link to="/login" className="nav-link">Login</Link>
                </div>
    )

    const [ toggled, setToggled ] = useState(false); 
    
    const handleToggleClick = () => {
        setToggled(!toggled);
    };

    if(removeHeader){
        return (
            <Fragment />
        )
    }

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
                { !loading && (<Fragment>{ isAuthenticated ? authLinks : guestLinks }</Fragment>)}
            </div>
        </div>
    )
}

Navbar.propTypes = {
    logout: PropTypes.func.isRequired, 
    auth: PropTypes.object.isRequired 
}

const mapStateToProps = state => ({
    auth: state.auth, 
    removeHeader: state.header.state.removeHeader
}); 

export default connect(mapStateToProps, { logout })(Navbar); 