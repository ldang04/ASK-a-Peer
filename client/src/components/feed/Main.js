import './feed.css';
import React, {Fragment, useEffect} from 'react'; 
import { connect } from 'react-redux';
import { loadUser } from '../../actions/auth';
import { Link } from 'react-router-dom';

import SpacesList from './SpacesList';

const Main = ({ auth: { isAuthenticated, loading }, user}) => {
    useEffect(() => {
        loadUser();
    }, []);

    const authenticatedMain = (
        <div>
            <div className="row justify-content-center">
                <div className="col-sm-4 auth-main-1">
                    <div className="container">
                        <SpacesList />
                    </div>
                </div>
                <div className="col-sm-7 auth-main-2">
                        <div className="card">
                            <div className="spaces-list-container">
                                <h3>Welcome to ASK-a-Peer, {user.fullName} </h3>
                                <p className="auth-main-small-text">ASK-a-Peer is a peer tutoring platform aimed at increasing peer tutoring opportunities at Phillips Academy. Ask or answer course-specific questions in a study space, reach out to a peer tutor via their profile page, or access the Academic Skills Centers' resources below. Encounter a problem? Email edarling23@andover.edu or ddang23@andover.edu to report any issues. </p>
                                <p className="auth-main-small-text small-text-i"><i>This application was made possible by the <a href="https://www.andover.edu/alumni/alumni-connect/abbot-academy/abbot-academy-fund">Abbot Academy Fund</a>, continuing Abbot's tradition of boldness, innovation, and caring.</i></p>
                            </div>
                        </div>
                        <div className="card card-under">
                            <div className="spaces-list-container">
                                <h3>Academic Skills Center Resources</h3>
                                <div className="container">
                                    <div className="row">
                                        <div classname="col-4">
                                            <Link to="https://canvas.andover.edu/courses/10099"><img src="https://www.apsva.us/wp-content/uploads/2019/07/canvas-icon.jpg" alt="Canvas Icon"/></Link>
                                        </div>
                                        <div classname="col-4">
                                        </div>
                                    </div>
                                </div>
                            </div>
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
    auth: state.auth, 
    user: state.auth.user
}); 

export default connect(mapStateToProps)(Main);

