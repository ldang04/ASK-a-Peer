import './layout.css';
import React from 'react'; 

const Navbar = () => {
    return (
        <div className="navbar navbar-expand-md">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">ASK-a-Peer</a>
                <div className="collapse navbar-collapse" id="resourcesNav">
                    <a className="nav-link" href="/">| Resources</a>
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#resourcesNav" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>
        </div>
    )
}

export default Navbar; 