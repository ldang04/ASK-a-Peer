import './App.css';
import React, {Fragment} from 'react'; 
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; 

import Navbar from './components/layout/Navbar'; 
import Register from './components/auth/Register'; 
import Login from './components/auth/Login'; 


const App = () => {
  return (
    <Router>
      <Fragment>
        <Switch>
          <Route exact path="/"> 
            <Navbar />
          </Route>
          <Route exact path="/auth/register" component={Register} /> 
          <Route exact path="/auth/login" component={Login} />
        </Switch>
    </Fragment>
    </Router>
  );
}

export default App;
