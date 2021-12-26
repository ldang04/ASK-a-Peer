import React, {useEffect, useState} from 'react'; 
import axios from 'axios'; 
import { Link } from 'react-router-dom';
import Spinner from '../loading/Spinner'; 

const SpacesList = () => {
    const [spaces, setSpaces ] = useState([]); 
    const [loading, setLoading] = useState(true);
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
                setLoading(false);
            });

            // Sort spaces alphabetically 
            // Method source: https://stackoverflow.com/questions/6712034/sort-array-by-firstname-alphabetically-in-javascript/18493652
            spaceArr.sort((a, b) => {
                if(a.title < b.title) return -1; 
                if(a.title > b.title ) return 1;
                return 
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

    if(loading){
        return (
            <div className="spaces-card card">
            <div className="spaces-list-container">
                <h3> Study Spaces </h3>
                <Spinner />
            </div>
        </div>
        )
    }

    if(error){
        setLoading(false);
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