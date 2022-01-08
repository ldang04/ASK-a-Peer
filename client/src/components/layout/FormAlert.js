import './layout.css';
import React from 'react';
import { connect } from 'react-redux';

const FormAlert = ({alerts}) => 
alerts !== null && alerts.length > 0 && alerts.map(alert => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}
    </div>
));

const mapStateToProps = state => ({
    alerts: state.formAlert
}); 

export default connect(mapStateToProps)(FormAlert);