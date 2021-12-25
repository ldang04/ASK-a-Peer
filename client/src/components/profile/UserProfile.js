import './profile.css';
import React, {Fragment} from 'react'; 
import { connect } from 'react-redux'; 
import { logout } from '../../actions/auth'; 
import AnswerList from './AnswersList'; 

const UserProfile = ({auth: { loading, user }, logout}) => {

    if(!loading){
        return (
            <div>
                <div className="profile-header" />
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-sm-3 profile-col-1">
                            <img src={user.avatar} className="profile-picture" alt="Profile Picture"/>
                            <div className="profile-description">
                                <h3>{user.fullName}</h3>
                                {user.pronouns ? <p className="profile-pronouns">{user.pronouns}</p> : <Fragment />}
                                {user.bio ? <p className="profile-bio">{user.bio}</p> : <Fragment />}
                            </div>
                            <div className="profile-btns">
                                <button className="btn btn-success edit-btn"><i class="fas fa-pen"></i> Edit</button>
                                <button onClick={logout} className="btn btn-primary logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</button>
                            </div>
                        </div>
                        <div className="col-12 col-sm-8 profile-col-2">
                            {user.answers ? <AnswerList answers={user.answers} /> : <Fragment />}
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div>Loading...</div>
        )
    }
    
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {logout })(UserProfile); 
