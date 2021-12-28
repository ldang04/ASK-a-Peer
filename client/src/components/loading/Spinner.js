import './loading.css';
import React from 'react'; 

// Spinner Source Code: https://loading.io/css/
const Spinner = () => {
    return (
        <div>
            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>
    )
}

export default Spinner; 