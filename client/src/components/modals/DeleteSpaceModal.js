import './modal.css'; 
import React from 'react';

const DeleteSpaceModal = ({ spaceTitle }) => {

    return (
        <div className="modal fade" id="delete-space-modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Delete Space</h5>
                        <button type="button" className="modal-close-btn"  data-dismiss="modal" aria-label="Close">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to delete this space?</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-success delete-modal-btn">Confirm</button>
                        <button className="btn btn-danger delete-modal-btn" data-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteSpaceModal;