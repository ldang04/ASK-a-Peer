import './App.css';
import React, {Fragment, useEffect} from 'react'; 
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; 

import Navbar from './components/layout/Navbar'; 
import Register from './components/auth/Register'; 
import Login from './components/auth/Login'; 
import Confirmation from './components/auth/Confirmation';
import Main from './components/feed/Main';
import Dashboard from './components/feed/Dashboard';
import UserProfile from './components/profile/UserProfile'; 
import PrivateRoute from './components/routing/PrivateRoute';
import Space from './components/space/Space';

import { Provider } from 'react-redux'; 
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import { LOGOUT } from './actions/types';

const App = () => {

  useEffect(() => {
    if(localStorage.token){
      setAuthToken(localStorage.token);
    }
    store.dispatch(loadUser());

    window.addEventListener('storage', () => {
      if(!localStorage.token){
        store.dispatch({ type: LOGOUT });
      }
    });
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
          <Fragment>
            <Switch>
              <Route exact path="/" component={Main} />
              <Route exact path="/register" component={Register} /> 
              <Route exact path="/login" component={Login} />
              <Route exact path="/auth/confirmation/:user_token" component={Confirmation} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/me" component={UserProfile} />
              <PrivateRoute exact path="/spaces/:space_id" component={Space} />
            </Switch>
        </Fragment>
        </Router>
    </Provider>
  );
}

export default App;
