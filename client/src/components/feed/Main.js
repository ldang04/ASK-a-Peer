import './feed.css';
import React, {Fragment, useEffect} from 'react'; 
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { showHeader } from '../../actions/header'; 

const Main = ({ auth: { isAuthenticated, loading }, showHeader }) => {
    useEffect(() => {
        showHeader();
    }, []); 
    const authenticatedMain = (
        <div className="container">
            <div className="row">
                <div className="col-sm-3">
                
                </div>
                <div className="col-sm-9">
                    <div className="card mt-5">
                        authenticated main
            <img  className="mt-5" src="https://static.wikia.nocookie.net/spongebob/images/d/d7/SpongeBob_stock_art.png/revision/latest?cb=20190921125147" />

                    </div>
                </div>
            </div>
        </div>
    ); 

    const guestMain = (
        <section>
            <div className="landing-header">
                <h1>Welcome to ASK-a-Peer</h1>
            </div>
            <ul className="slideshow">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </section>
    ); 

    return (
        <div>
            { !loading && (<Fragment>{ isAuthenticated ? authenticatedMain : guestMain }</Fragment>)}
        </div>
    )
}

const mapStateToProps = (state) => ({
    auth: state.auth
}); 

export default connect(mapStateToProps, {showHeader})(Main);

