import './space.css';
import React, { useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'; 

const ModeratorList = ({moderators}) => {

    const renderedModerators = moderators.map(moderator => {
        return (
            <Link key={moderator._id} className="mod-btn" to={`/profile/${moderator._id}`}><img className="mod-img" src={moderator.avatar} /></Link>
        )
    });
    return (
        <div className="mod-list">
            <p className="mod-subtitle">Moderators:</p>
            {renderedModerators}
        </div>
    );
}

export default ModeratorList;
