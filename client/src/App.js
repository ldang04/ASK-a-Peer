import './App.css';
import React, {Fragment} from 'react'; 
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; 

import Navbar from './components/layout/Navbar'; 
import Register from './components/auth/Register'; 
import Login from './components/auth/Login'; 
import Confirmation from './components/auth/Confirmation';

import { Provider } from 'react-redux'; 
import store from './store';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
          <Fragment>
            <Switch>
              <Route exact path="/"> 
                <Navbar />
              </Route>
              <Route exact path="/auth/register" component={Register} /> 
              <Route exact path="/auth/login" component={Login} />
              <Route exact path="/auth/confirmation/:user_token" component={Confirmation} />
            </Switch>
        </Fragment>
        </Router>
    </Provider>
  );
}

export default App;
