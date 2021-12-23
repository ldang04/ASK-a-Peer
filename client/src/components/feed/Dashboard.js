import './feed.css';
import React, {Fragment, useEffect} from 'react'; 
import { connect } from 'react-redux';
import { loadUser } from '../../actions/auth';
import { Redirect } from 'react-router-dom';

import SpacesList from './SpacesList';

const Dashboard = (user) => {
    if (user == null ){
        return <Redirect to="/login" />
    }
    return (
        <div>
            <div className="row justify-content-center">
                <div className="col-sm-4 auth-main-1 order-2 order-sm-1">
                    <div className="container">
                        <SpacesList />
                    </div>
                </div>
                <div className="col-sm-7 auth-main-2 order-1 order-sm-2">
                        <div className="card dash-container">
                            <div className="welcome-container">
                                <h3>Welcome to ASK-a-Peer! {user.fullName} </h3>
                                <p className="auth-main-small-text"> Ask or answer course-specific questions in a study space, reach out to a peer tutor via their profile page, or access the Academic Skills Centers' resources below. Encounter a problem? Email edarling23@andover.edu or ddang23@andover.edu to report any issues. </p>
                                <p className="auth-main-small-text small-text-i"><i>This application was made possible by the <a href="https://www.andover.edu/alumni/alumni-connect/abbot-academy/abbot-academy-fund">Abbot Academy Fund</a>, continuing Abbot's tradition of boldness, innovation, and caring.</i></p>
                            </div>
                        </div>
                        <div className="card card-under dash-container">
                            <div className="resources-container">
                                <h3>Academic Skills Center Resources</h3>
                                <div className="resources-outer">
                                    <div className="dash-resources">
                                        <div className="dash-resource">
                                            <a href="https://canvas.andover.edu/courses/10099"><img className="dash-link" src="https://www.apsva.us/wp-content/uploads/2019/07/canvas-icon.jpg" alt="Canvas Icon"/></a>
                                            <p className="dash-resource-label">ASC Canvas Page</p>
                                        </div>
                                        <div className="dash-resource">
                                            <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=2etliuh7d0S1RZtt-BrSozQLXgfJN3JLrB6uje_YlZhUNEszU1M4VkJBSDNDQ0QxVEpHTEIzT05GRS4u"><img className="dash-link" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAmVBMVEX////U3+rgWVFInePT3urg6PDhUEbYtr3U4u34+vwJM1f20tDeTUPa4+3iaWLgV09PoOM7mOMAMFfE1+noW1EAG0m3UFLQ1txNZHxEO1Xz9vkALFMwS2l7ipsAA0EAJE799fT43dzIsbZKWHG1R0nnT0PurqveRDrwt7XmgHrLVVJjP1WpTVPGU1LjYlq4wMmgq7ePmqlRPFVuM91tAAAC40lEQVR4nO3c21baUBCAYQiBFgrGBlQMKuAJwTPv/3Cl7FyRcSfsJNtJ+/+3Axk/iCuALFstIiIiIiIiIiIiIiKiRvc+vbpOPO5Lrq+m7x73tT5uZvF80Pe2rz+Yx7ObD2/7WsnZYNf809vCz/nfhWf+zpqLvXA29bZwOtsLL7wtRFh5CCsPYeUhLNdi+euw2/3lKb7LDOrqLt5fgG8zg+WitG+57g0z3e8XDi4fsqNaerjc74vvs6PeelkO+LiKouCw6DwVTjKjepqkwnPhZ4lWj2WATytpoSbhrtWTO3CxEg+pTBgNF+5PYU9cqEwY9NyfxLV8RG3CaO0sPGmI8KRy4cYIn70Jn41w40sYTLax5SGtPnPSxNsvHtEahEGwjePBi6+ncPeQvgziePvVtBbhZPMa+APu9gWvmy/31SIMhJc69WZZWI9QUwgR6g8hQv0hRKg/hAj1hxCh/hAi1B9ChPpDiFB/CBHqDyFC/SG09DbsNaHhm7PwR1NyFv5sSs7CUbsZjRAiVB9ChPpDiFB/CBHqDyFC/VUnDLvSrfqhZU16z6NnZnUo/lODboiwcAhNCBFaViNEmBtCE0KEltUIEeaG0IQQoWU1QoS5/X9CrSFEqD+ECAvvEaqJdLi5MqH1ejjunAql9xQPn87Ea57GK/74dyfb6ShfaFmNEGFuCE0IEVpWI0SYG0ITQoSW1QgR5obQhBChZbU2oVCnYUL587T0VuFYKv9+zrN6hDpDiFB/CI8QhmK2YcmZb2HY7Qsl6d/xpVl6rWyLs/Sg4uyo06fB31RAiDA3hCaECAutRugYQhNChIVWI3QMoQkhwkKrETqG0PQvCdujrlT6aZM4a5ebeRfW8omhpk8TtYYQof4QItQfQoT6cxce9+rw+xLfEBQqOe7l4XcVJs7C1qgJxND9JN299WvrJ4byG8zCRPXPYjgSv913RElX/PaclrolfgeJiIiIiIiIiIiIiIj89gd2v9+Vj7wdZwAAAABJRU5ErkJggg==" alt="Calendar icon" /></a>
                                            <p className="dash-resource-label">Academic Scheduling Tool</p>
                                        </div>
                                        <div className="dash-resource">
                                            <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=2etliuh7d0S1RZtt-BrSo-Mxdh5UPJJHigC5eJQ6YUhUM1FIOUhOQ1JYRFNTTklPUVdFVVFVU1Y4TSQlQCN0PWcu"><img className="dash-link" src="https://www.freeiconspng.com/thumbs/meeting-icon/meeting-icon-png-presentation-icon-board-meeting-icon-meeting-icon--4.png" alt="Meeting icon" /></a>
                                            <p className="dash-resource-label">Request an ASC meeting</p>
                                        </div>
                                        <div className="dash-resource">
                                            <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=2etliuh7d0S1RZtt-BrSo-Mxdh5UPJJHigC5eJQ6YUhUNzBaOUg2T0czTFdDUUtDTkNTOUlMTU9aTSQlQCN0PWcu"><img className="dash-link" src="https://thumbs.dreamstime.com/b/student-icon-white-background-71302919.jpg" alt="Meeting icon" /></a>
                                            <p className="dash-resource-label">Request a Peer Tutor</p>
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

const mapStateToProps = state => ({
    user: state.auth.user
});

export default connect(mapStateToProps)(Dashboard); 