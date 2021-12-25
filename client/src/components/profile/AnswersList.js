import './profile.css';
import React, {Fragment, useState, useEffect} from 'react'; 
import axios from 'axios'; 
import { Link } from 'react-router-dom'; 

const AnswerList = ({ answers }) => {

    const renderedAnswers = answers.map(answer => {
        return (
            <div className="answer-card card">
                <div className="answer-container">
                    <Link className="answer-title-link" to={`/answers/${answer._id}`}><h3>{answer.questionName}</h3></Link>
                    <p>{answer.description}</p>
                    <div className="answer-btns">
                        <button className="helpful-btn">Helpful <span>{answer.upvotes.length}</span></button>
                        <button className="comment-btn">Comments <span>{answer.comments.length}</span></button>
                    </div>
                </div>
            </div>
        )
    }); 

    return (
       <Fragment>
           {renderedAnswers}
       </Fragment>
    )
}

export default AnswerList; 