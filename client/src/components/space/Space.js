import './space.css';
import React, { useEffect, Fragment } from 'react'; 
import SpaceList from '../feed/SpacesList';
import { useLocation, Redirect, Link } from 'react-router-dom'; 
import { connect } from 'react-redux'; 
import { getSpace, toggleHelpful } from '../../actions/spaces';
import ModeratorList from './ModeratorList';
import AdminList from './AdminList';
import EditSpaceModal from '../modals/EditSpaceModal';
import Alert from '../layout/Alert';

const Space = ({ auth: { loading, isAuthenticated, user }, getSpace, space: { space },toggleHelpful}) => {
    const location = useLocation();

    useEffect(() => {
        // Find space by space id 
        const spaceId = location.pathname.split('/spaces/')[1];
        getSpace(spaceId);
    }, [space]);

    if(!isAuthenticated){
        return <Redirect to="/login" />
    }

    if(!space && loading){
        return <div>Loading... </div>
    }

    if(!space){
        return <div>Space not found </div>
    }

    if(space){
        const renderedAnswers = space.questions.map(question => {
            if(question.answers.length === 0 ){
                return <Fragment key={question._id}/>
            } 
            const onHelpfulClick = () => {
                toggleHelpful(question.answers[0]._id, space._id)
            }
            return (
                 <div className="card answer-card" key={question._id}>
                    <div className="answer-container">
                        <Link className="title-link" to={`/questions/${question._id}`}><h3>{question.title}</h3></Link>
                        <p style={{color: '#888888'}}><i>Answered by <Link to={`/users/${question.answers[0].creator._id}`}>{question.answers[0].creator.fullName}</Link></i></p>
                        <p>{question.answers[0].description}</p>
                        {(question.answers.length === 2) ? <Link to={`/questions/${question._id}`} className="answer-link">View 1 more answer</Link> : <Fragment />}
                        {(question.answers.length > 2) ? <Link to={`/questions/${question._id}`} className="answer-link">View {(question.answers.length - 1 )} more answers</Link> : <Fragment />}

                        <div className="answer-btns">
                            <button onClick={onHelpfulClick} className="helpful-btn">Helpful <span>{question.answers[0].upvotes.length}</span></button>
                            <button className="comment-btn">Comments <span>{question.answers[0].comments.length}</span></button>
                            {/* {user.admin ? <button className="btn btn-danger delete-btn">Delete</button> : <Fragment />} */}

                        </div>
                    </div>
                </div>
                );
            
        });

        const adminEmails = space.admins.map(admin => admin.email);
        const modEmails = space.moderators.map(moderator => moderator.email);

        const removeModal = () => {
            document.getElementById("edit-space-modal").classList.remove("show", "d-block");
            document.querySelectorAll(".modal-backdrop").forEach(el => el.classList.remove("modal-backdrop"));
        }

        return (
            <div>
                <EditSpaceModal title={space.title} admins={adminEmails.join()} moderators={modEmails.join()} removeModal={removeModal} />
                <div className="row justify-content-center">
                    <div className="space-col-1 col-12 col-sm-4 order-2 order-sm-1">
                        <div className="container">
                            <SpaceList />
                        </div>
                    </div>
                    <div className="space-col-2 col-12 col-sm-7 order-1 order-sm-2">
                        <Alert />
                        <div className="card space-card pb-4" >
                            <h3>{space.title}</h3>
                            <AdminList admins={space.admins}/> 
                            <ModeratorList moderators={space.moderators} />
                            <div>
                                {user.admin ? <button className="btn btn-success edit-btn space-edit-btn" data-toggle="modal" data-target="#edit-space-modal"><i className="fas fa-pen"></i> Edit </button> : <Fragment />}
                            </div>
                        </div>
                        {renderedAnswers}
                    </div>
                </div>
            </div>
        )
    }
    
    return <div>Something went wrong</div>
}

const mapStateToProps = (state) => ({
    auth: state.auth, 
    space: state.space
});

export default connect(mapStateToProps, { getSpace, toggleHelpful })(Space); 