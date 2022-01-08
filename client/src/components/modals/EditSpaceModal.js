import './modal.css'; 
import React, {useState} from 'react';
import { setFormAlert } from '../../actions/alert';
import { updateSpace } from '../../actions/spaces';
import { connect } from 'react-redux'; 
import FormAlert from '../layout/FormAlert';

const EditSpaceModal = ({ title, admins, moderators, setFormAlert, updateSpace, spaceId, removeModal }) => {
    const [formData, setFormData] = useState({
        title,
        admins,
        moderators
    });

    const onFormSubmit = e => {
        e.preventDefault();
        if(formData.title.replace(/\s/g, '').length === 0){
            return setFormAlert('Space title is required', 'danger');
        }
        if(formData.admins.replace(/\s/g, '').length === 0){
            return setFormAlert('At least one admin is required', 'danger');
        }
        updateSpace(spaceId, formData);
        removeModal();
    }

    const onInputChange = e => setFormData({...formData, [e.target.name]: e.target.value}); 


    return (
        <div className="modal fade" id="edit-space-modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Space</h5>
                        <button type="button" className="modal-close-btn"  data-dismiss="modal" aria-label="Close">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <form onSubmit={onFormSubmit}>
                    <div className="modal-body">
                        <FormAlert />
                        <div className="form-group">
                            <label className="form-label-text">Space Title</label>
                            <input type="text" className="form-control" name="title" value={formData.title} onChange={e => onInputChange(e)}/>
                        </div>
                        <div className="form-group">
                            <label className="form-label-text">Admins</label>
                            <input type="text" className="form-control" name="admins" value={formData.admins} onChange={e => onInputChange(e)}/>
                        </div>
                        <div className="form-group">
                            <label className="form-label-text">Moderators</label>
                            <input type="text" className="form-control" name="moderators" value={formData.moderators} onChange={e => onInputChange(e)}/>
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

const mapStateToProps = state => ({
    spaceId: state.space.space._id
});

export default connect(mapStateToProps, { setFormAlert, updateSpace })(EditSpaceModal);