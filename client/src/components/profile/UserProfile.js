import './profile.css';
import React, {Fragment, useEffect} from 'react'; 
import { connect } from 'react-redux'; 
import { logout, updateUser } from '../../actions/auth'; 
import AnswerList from './AnswersList'; 
import EditUserModal from '../modals/EditUserModal'; 
import Alert from '../../components/layout/Alert';

const UserProfile = ({auth: { loading, user }, logout }) => {

    if(!loading){
         
        return (
            <div>
                {user ? <EditUserModal user={user} /> : <Fragment />}
                <div className="profile-header container">
                    <div style={{position: "relative", top: "8rem"}}>
                        <Alert />
                    </div>
                </div>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-sm-3 profile-col-1">
                            <img src={user.avatar} className="profile-picture" alt="Profile Picture"/>
                            <div className="profile-description">
                                <h3>{user.fullName}</h3>
                                {(user.pronouns.replace(/\s/g,'') === '') ? <Fragment /> : <p className="profile-pronouns">{user.pronouns}</p> }
                                {(user.bio.replace(/\s/g,'') === '') ? <Fragment /> : <p className="profile-bio">{user.bio}</p>}
                                
                            </div>
                            <div className="profile-btns">
                                <button className="btn btn-success edit-btn" data-toggle="modal" data-target="#edit-profile-modal"><i className="fas fa-pen"></i> Edit</button>
                                <button onClick={logout} className="btn btn-primary logout-btn"><i className="fas fa-sign-out-alt"></i> Logout</button>
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
    auth: state.auth, 
});

export default connect(mapStateToProps, {logout, updateUser })(UserProfile); 
