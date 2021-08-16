import './layout.css';
import React, {useState} from 'react'; 
import { Link } from 'react-router-dom'

const Navbar = () => {
    const [ toggled, setToggled ] = useState(false); 
    
    const handleToggleClick = () => {
        setToggled(!toggled);
    }

    return (
        <div className="navbar navbar-expand-md d-flex">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand" >ASK-a-Peer</Link>
                <div className="collapse navbar-collapse collapse-nav">
                    <a className="nav-link">| Resources</a>
                    {/*Search bar*/}
                    {/*Ask a Question Button*/}
                    
                </div>
                <div className="collapse navbar-collapse collapse-nav ml-auto to-right">
                    <Link to="/auth/register" className="nav-link">Register</Link>
                    <Link to="/auth/login" className="nav-link">Login</Link>
                </div>
                <button onClick={handleToggleClick} className={`navbar-toggler ${toggled ? "my-2" : ""}`} type="button" data-bs-toggle="collapse" data-bs-target=".collapse-nav" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <i className={`fas ${toggled ? "fa-minus" : "fa-bars"} toggle-icon`}></i>
                </button>
            </div>
        </div>
    )
}

export default Navbar; 