import './modal.css'; 
import React, {useState, useEffect, Fragment} from 'react';
import objectPath from 'object-path';

const EditModal = ({  dataTarget, modalHeader, inputs, onEditSubmit, currentImage }) => {
    const [selectedImage, setSelectedImage] = useState(currentImage);
    const [formData, setFormData] = useState({avatar: selectedImage});

    const handleImageClick = e => {
        e.preventDefault();
        // set selected image using src url. 
        setSelectedImage(e.target.src); 
        setFormData({...formData, ["avatar"] : e.target.src});
    }

    const onFormSubmit = e => {
        e.preventDefault();
        onEditSubmit(formData);
    }

    const onInputChange = e => setFormData({...formData, [e.target.name]: e.target.value}); 

    const renderedInputs = inputs.map((input) => {
        if(input.inputType == "text"){
            let valuePath = objectPath.get(formData, input.value);
            if(input.value === "" && input.name === 'pronouns'){
                valuePath = ""; 
            } else if (input.value === "" && input.name === 'bio'){
                valuePath = "";
            } else if (input.value==="" && input.name === 'email'){
                valuePath="";
            } else if(input.value === "" && input.name === "title"){
                valuePath="";
            } else {
                valuePath = objectPath.get(formData, input.value);
            }
            return (
                <div className="form-group" key={input.name}>
                    <label className="form-label-text">{input.label}</label>
                    <input type="text" maxlength={input.maxLength ? input.maxLength : null} className="form-control" name={input.name} value={valuePath} defaultValue={(input.value === "") ? "" : input.value } onChange={e => onInputChange(e)}/>
                    {input.maxLength ? <div className="form-text" style={{float: 'right'}}>Max. characters: {input.maxLength} </div> : <Fragment />}
                </div>
            )
        } else if (input.inputType == "textarea"){
            let valuePath = objectPath.get(formData, input.value);
            return (
                <div className="form-group" key={input.name}>
                    <label className="form-label-text">{input.label}</label>
                    <input type="textarea" className="form-control" name={input.name} value={valuePath} defaultValue={(input.value === "") ? "" : input.value} onChange={e => onInputChange(e)}/>
                </div>
            )
        } else if (input.inputType == "imageSelection"){
            const renderedImages = input.dropdownItems.map(image => {
                if(selectedImage == image){
                    return (
                        <button className="image-selection-btn" style={{border: "3px solid #13aa52"}} onClick={handleImageClick}><img src={image} className="selection-image" alt="Profile Picture" /></button>
                    )
                } 
                return (
                    <button className="image-selection-btn" onClick={handleImageClick}><img src={image} className="selection-image" alt="Profile Picture"/></button>
                )
            }); 

            return (
                <div className="form-group" key={input.name}>
                    <label className="form-label-text">{input.label}</label>
                    <div className="image-container">
                        {renderedImages}
                    </div>
                </div>
            )
        } 
    });

    return (
        <div className="modal fade" id={dataTarget} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{modalHeader}</h5>
                        <button type="button" className="modal-close-btn"  data-dismiss="modal" aria-label="Close">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <form onSubmit={onFormSubmit}>
                    <div className="modal-body">
                        {renderedInputs}
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

export default EditModal; 