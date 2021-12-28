import './space.css';
import React from 'react'; 
import SpaceList from '../feed/SpacesList';

const Space = () => {
    return (
        <div className="row justify-content-center order-2 order-sm-1">
            <div className="space-col-1 col-sm-4">
                <SpaceList />
            </div>
            <div className="space-col-2 col-sm-7">

            </div>
        </div>
    )
}

export default Space; 