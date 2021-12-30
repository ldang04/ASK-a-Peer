import './space.css';
import React, { useEffect, Fragment, useState } from 'react'; 
import SpaceList from '../feed/SpacesList';
import { useLocation, Redirect, Link } from 'react-router-dom'; 
import { connect } from 'react-redux'; 
import { getSpace, toggleHelpful } from '../../actions/spaces';
import ModeratorList from './ModeratorList';
import AdminList from './AdminList';

const Space = ({ auth: { loading, isAuthenticated }, getSpace, space: { space }, toggleHelpful}) => {
    const location = useLocation();

    useEffect(() => {
        console.log('Space component hit');
        // Find space by space id 
        const spaceId = location.pathname.split('/spaces/')[1];
        getSpace(spaceId);
    }, []);

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
                        <p>{question.answers[0].description}</p>
                        {(question.answers.length === 2) ? <Link to={`/questions/${question._id}`} className="answer-link">View 1 more answer</Link> : <Fragment />}
                        {(question.answers.length > 2) ? <Link to={`/questions/${question._id}`} className="answer-link">View {(question.answers.length - 1 )} more answers</Link> : <Fragment />}

                        <div className="answer-btns">
                            <button onClick={onHelpfulClick} className="helpful-btn">Helpful <span>{question.answers[0].upvotes.length}</span></button>
                            <button className="comment-btn">Comments <span>{question.answers[0].comments.length}</span></button>
                        </div>
                    </div>
                </div>
                );
            
        });

        return (
            <div className="row justify-content-center">
                <div className="space-col-1 col-12 col-sm-4 order-2 order-sm-1">
                    <div className="container">
                        <SpaceList />
                    </div>
                </div>
                <div className="space-col-2 col-12 col-sm-7 order-1 order-sm-2">
                    <div className="card space-card" >
                        <h3>{space.title}</h3>
                        <AdminList admins={space.admins}/>
                        <ModeratorList moderators={space.moderators} />
                    </div>
                    {renderedAnswers}
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