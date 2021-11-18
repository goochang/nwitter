import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Profile from 'routes/Profile';
import Navigation from './Navigation';

const AppRouter = ({isLoggedIn, userObj, refreshUser}) => {
    return (
        <Router>
            {isLoggedIn && <Navigation userObj={userObj} />}
            <Switch>
                {/* <Route exact path="/" component={Home}/> */}
                {isLoggedIn ? (
                    <>
                    <Route exact path="/" 
                    render={()=> <Home userObj={userObj} /> }/>
                    <Route exact path="/profile" 
                    render={()=> <Profile userObj={userObj} refreshUser={refreshUser} />}/>
                    </>
                ) : (
                    <Route exact path="/" component={Auth}/>
                )}
            </Switch>
        </Router>
    )
}

export default AppRouter;