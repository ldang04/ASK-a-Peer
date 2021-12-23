import React, {useEffect, useState} from 'react'; 
import axios from 'axios'; 
import { Link } from 'react-router-dom';

const SpacesList = () => {
    const [spaces, setSpaces ] = useState([]); 
    const [error, setError] = useState(false);
    
    // Fetch spaces 
    const fetchSpaces = async () => {
        try {
            const res = await axios.get('/spaces'); 
            let spaceArr = [];
            res.data.forEach(space => {
                let spaceObject = {}; 
                spaceObject.title = space.title; 
                spaceObject.link = `/spaces/${space._id}`;

                spaceArr.push(spaceObject);
                
            });
            setSpaces(spaceArr);
            setError(false);
        } catch {
            setError(true);
        }
    }

    // Get spaces from server 
    useEffect(() => {
        fetchSpaces();
        console.log(spaces);
    }, []); 

    // Dynamically render spaces 
    const renderedSpaces = spaces.map((space, index) => {
        return (
            <div>
                <ol className="space-link">
                    <Link to={space.link} className="space-link" key={index}>{space.title}</Link>
                </ol>
                <hr className="space-link-hr"/>
            </div>
        )
    }); 

    if(error){
        return (
            <div className="spaces-card card">
            <div className="spaces-list-container">
                <h3> Study Spaces </h3>
                <p className="auth-main-error">Something went wrong. Refresh the page or try again later.</p>
            </div>
        </div>
        )
    }
    return (
        <div className="spaces-card card">
            <div className="spaces-list-container">
                <h3> Study Spaces </h3>
                <ul>
                    <hr />
                    {renderedSpaces}
                </ul>
            </div>
        </div>
    )
}

export default SpacesList; 