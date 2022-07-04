import './modal.css'; 
import React, {useState} from 'react';
import { setAlert } from '../../actions/alert';
import { createSpace } from '../../actions/spaces';
import Alert from '../layout/Alert';
import { connect } from 'react-redux'; 

const EditSpacelistModal = ({ setAlert, createSpace }) => {
    const [formData, setFormData] = useState({title: ""});

    const onFormSubmit = e => {
        e.preventDefault();
        if(formData.title.replace(/\s/g, '').length === 0){
            return setAlert('Space title is required', 'danger');
        }
        createSpace(formData);
    }

    const onInputChange = e => setFormData({...formData, [e.target.name]: e.target.value}); 

    return (
        <div className="modal fade" id="edit-spacelist-modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create a Space</h5>
                        <button type="button" className="modal-close-btn"  data-dismiss="modal" aria-label="Close">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <form onSubmit={onFormSubmit}>
                    <div className="modal-body">
                        <Alert />
                        <div className="form-group">
                            <label className="form-label-text">Space Title</label>
                            <input type="text" className="form-control" name="title" value={formData.title} maxLength="50" onChange={e => onInputChange(e)}/>
                            <div className="form-text" style={{float: 'right'}}>Max. characters: 50 </div>
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

export default connect(null, { setAlert, createSpace })(EditSpacelistModal);