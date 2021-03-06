import React, {useEffect, useState, Fragment} from 'react'; 
import { Link } from 'react-router-dom';
import Spinner from '../loading/Spinner'; 
import { getAllSpaces } from '../../actions/spaces'; 
import { connect } from 'react-redux'; 
import EditSpacelistModal from '../modals/EditSpacelistModal';
import DeleteSpaceModal from '../modals/DeleteSpaceModal';

const SpacesList = ({ user, space: { spaces, loading}, getAllSpaces }) => {
    const [editMode, setEditMode] = useState(false);

    // Get spaces
    useEffect(() => {
        getAllSpaces();
        console.log(editMode);
    }, []); 

    if(loading || !user){
        return (
            <div className="spaces-card card">
            <div className="spaces-list-container">
                <h3> Study Spaces</h3>
                <Spinner />
            </div>
        </div>
        )
    }
   
    if(user){
        // Dynamically render spaces 
        const renderedSpaces = spaces.map((space, index) => {
            return (
                <div key={index}>
                    <ol className="space-link">
                        {editMode ? <span className="delete-space-span"><button className="delete-space-btn" data-toggle="modal" data-target="#delete-space-modal" ><i className="far fa-trash-alt"></i></button></span> : <Fragment />}
                        <Link to={space.link} className="space-link"><span>{space.title}</span></Link>
                    </ol>
                    <hr className="space-link-hr"/>
                </div>
            )
        }); 

        return (
            <div>
            <DeleteSpaceModal />
            <EditSpacelistModal />
                <div className="spaces-card card">
                    <div className="spaces-list-container">
                            <h3 className="spacelist-title">Study Spaces</h3>
                            <span className="spacelist-btns">
                                {editMode ? <button className="spacelist-add-btn" data-toggle="modal" data-target="#edit-spacelist-modal"><i className="fas fa-plus"></i></button> : <Fragment />}
                                {user.admin ? <button onClick={() => setEditMode(!editMode)} className="spacelist-top-btn"><i className="fas fa-pen"></i></button> : <Fragment />} 
                            </span>
                        <ul>
                            <hr />
                            {renderedSpaces}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="spaces-card card">
        <div className="spaces-list-container">
            <h3> Study Spaces</h3>
            <p className="auth-main-error">Something went wrong. Refresh the page or try again later.</p>
        </div>
    </div>
    )
}





const mapStateToProps = (state) => ({
    user: state.auth.user, 
    space: state.space
});

export default connect(mapStateToProps, { getAllSpaces })(SpacesList); 