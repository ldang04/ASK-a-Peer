import './space.css';
import React from 'react'; 
import { Link } from 'react-router-dom';
import axios from 'axios'; 

const AdminList = ({ admins }) => {
    const renderedAdmins = admins.map(admin => {
        return (
            <Link key={admin._id} className="mod-btn" to={`/profile/${admin._id}`}><img className="mod-img" src={admin.avatar} /></Link>
        );
    });

    return (
        <div className="mod-list">
            <p className="mod-subtitle">{(admins.length <= 1 ) ? "Admin:" : "Admins"}</p>
            {renderedAdmins}
        </div>
    );
}

export default AdminList;