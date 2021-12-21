import './feed.css';
import React, {Fragment} from 'react'; 
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Spaces from './Spaces';

const Main = ({ auth: { isAuthenticated, loading } }) => {

    const authenticatedMain = (
        <div>
            <div className="row justify-content-center">
                <div className="col-sm-4 temp-col">
                    <div className="container">
                        <Spaces />
                    </div>
                </div>
                <div className="col-sm-7 temp-col-2">
                    <div className="container">

                    </div>
                </div>
            </div>
        </div>
    ); 

    const guestMain = (
        <section>
            
            <div className="row">
                <div className="col-12 col-lg-7 landing-left">
                    <div className="container landing-left-container">
                        <div className="landing-title">
                            <div className="landing-line"></div>
                            <h1 className="">Welcome to <br/> ASK-a-Peer</h1>
                        </div>
                        <p className="landing-subtitle"> A student-made peer tutoring platform aimed at increasing peer tutoring opportunities at Phillips Academy. Made possible by the <a className="aaf-link" href="https://www.andover.edu/alumni/alumni-connect/abbot-academy/abbot-academy-fund">Abbot Academy Fund</a>.</p>
                    </div>
                </div>
                <div className="col-12 col-lg-5 landing-right m-0">
                    
                </div>
            </div>
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

export default connect(mapStateToProps)(Main);

