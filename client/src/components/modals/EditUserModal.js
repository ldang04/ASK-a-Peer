import './modal.css'; 
import React, {useState} from 'react';
import { updateUser } from '../../actions/auth';
import { connect } from 'react-redux'; 

const EditUserModal = ({ user, updateUser }) => {
    const [selectedImage, setSelectedImage] = useState(user.avatar);
    const [formData, setFormData] = useState({
        pronouns: user.pronouns, 
        bio: user.bio, 
        avatar: user.avatar
    });

    const handleImageClick = e => {
        e.preventDefault();
        setSelectedImage(e.target.src); 
        setFormData({...formData, ["avatar"] : e.target.src});
    }

    const onFormSubmit = e => {
        e.preventDefault();
        updateUser(formData);
        document.getElementById("edit-profile-modal").classList.remove("show", "d-block");
       document.querySelectorAll(".modal-backdrop").forEach(el => el.classList.remove("modal-backdrop"));
    }

    const onInputChange = e => setFormData({...formData, [e.target.name]: e.target.value}); 

    const dropdownItems = [
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
    ]; 

    const renderedImages = dropdownItems.map(image => {
        if(selectedImage === image){
            return (
                <button className="image-selection-btn" style={{border: "3px solid #13aa52"}} onClick={handleImageClick}><img src={image} className="selection-image" alt="Profile Picture" /></button>
            )
        } 
        return (
            <button className="image-selection-btn" onClick={handleImageClick}><img src={image} className="selection-image" alt="Profile Picture"/></button>
        )
    });

    return (
        <div className="modal fade" id="edit-profile-modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Profile</h5>
                        <button type="button" className="modal-close-btn"  data-dismiss="modal" aria-label="Close">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <form onSubmit={onFormSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                        <label className="form-label-text">Profile Picture</label>
                        <div className="image-container">
                            {renderedImages}
                        </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label-text">Pronouns</label>
                            <input type="text" className="form-control" name="pronouns" value={formData.pronouns} onChange={e => onInputChange(e)}/>
                        </div>
                        <div className="form-group">
                            <label className="form-label-text">Bio</label>
                            <input type="text" maxlength="100" className="form-control" name="bio" value={formData.bio} onChange={e => onInputChange(e)}/>
                            <div className="form-text" style={{float: 'right'}}>Max. characters: 100 </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="btn btn-primary modal-save-btn">Save changes</button>
                    </div>
                    </form>
                </div>
        </div>
    </div>
    )
}

export default connect(null, { updateUser })(EditUserModal);