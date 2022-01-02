import './profile.css';
import React, {Fragment, useEffect} from 'react'; 
import { connect } from 'react-redux'; 
import { logout, updateUser } from '../../actions/auth'; 
import AnswerList from './AnswersList'; 
import EditModal from '../layout/EditModal'; 
import Alert from '../../components/layout/Alert';

const UserProfile = ({auth: { loading, user }, logout, updateUser}) => {

    if(!loading){
         // TODO: user profile rerender after edit 
    const editInputs = [
        {
            label: "Profile Picture",
            name: "avatar",
            inputType: "imageSelection", 
            dropdownItems: [
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN7CpOCIvMdVtRvYFgt00QhehUNmgdoUX5RQ&usqp=CAU", 
                "https://i1.sndcdn.com/avatars-000227190849-ksv67m-t500x500.jpg", 
                "https://64.media.tumblr.com/1f239fc9d7b8589b9e540ffa05dc2c88/tumblr_pm9ec3YqDX1xde1l9o1_250.png", 
                "https://i.pinimg.com/236x/ff/1f/c2/ff1fc2bdf1d06b6ce933b8804965d914.jpg", 
                "https://64.media.tumblr.com/4dc9376acb9f72b765a6763b1c6d6eb9/tumblr_p1bahjjC8Z1tc5gvpo5_250.png",
                "https://64.media.tumblr.com/495a60e4c98c526a9ed6900aeb4764d0/d6d166501afbe14d-35/s540x810/5a0e551e266a074938abc9f9916bb230598f7cbc.jpg",
                "https://i.pinimg.com/originals/c8/f6/79/c8f6799ead74a420b433c4e3e551067d.png",
                "https://i.pinimg.com/originals/40/a0/d5/40a0d5409835cbcd2907e1a41edb76d0.jpg",
                "https://www.personality-database.com/profile_images/6929.png",
                "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/d7238e10-4854-4a11-aea9-43783972cbc6/ddv9pal-558ddd02-a360-41a4-b34f-05d280bf56dd.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2Q3MjM4ZTEwLTQ4NTQtNGExMS1hZWE5LTQzNzgzOTcyY2JjNlwvZGR2OXBhbC01NThkZGQwMi1hMzYwLTQxYTQtYjM0Zi0wNWQyODBiZjU2ZGQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.OtlK-OPyrxk-Yqu0u3kM4jSaSvP5Le-3dEEhQ6Xw1M4"
            ], 
            value: user.avatar
        },
        {
            label: "Pronouns", 
            name: "pronouns",
            inputType: "text", 
            value: user.pronouns,
            maxLength: null
        }, 
        {
            label: "Bio", 
            name: "bio",
            inputType: "text", 
            value: user.bio,
            maxLength: 100
        }
    ];

    const onEditSubmit = (editValues) => {
        if(editValues === null){
           return true;
       } 
       updateUser(editValues);
       document.getElementById("edit-modal").classList.remove("show", "d-block");
       document.querySelectorAll(".modal-backdrop").forEach(el => el.classList.remove("modal-backdrop"));
    }
        return (
            <div>
                <EditModal modalHeader="Edit Profile" dataTarget="edit-modal" inputs={editInputs} currentImage={user.avatar} onEditSubmit={onEditSubmit}/>
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
                                {(user.pronouns === '') ? <Fragment /> : <p className="profile-pronouns">{user.pronouns}</p> }
                                {(user.bio === '') ? <Fragment /> : <p className="profile-bio">{user.bio}</p>}
                                
                            </div>
                            <div className="profile-btns">
                                <button className="btn btn-success edit-btn" data-toggle="modal" data-target="#edit-modal"><i className="fas fa-pen"></i> Edit</button>
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
