import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Profile from 'routes/Profile';
import LeftMenu from './LeftMenu';
import Navigation from './Navigation';

const AppRouter = ({isLoggedIn, userObj, refreshUser}) => {
    return (
        <Router>
            <div className="main">
            {/* {isLoggedIn && <Navigation userObj={userObj} />} */}
            <LeftMenu />
            <Switch>
                <>
                    <main>
                        <Route exact path="/" 
                        render={()=> <Home userObj={userObj} /> }/>
                        <Route path="/profile" 
                        render={()=> <Profile userObj={userObj} refreshUser={refreshUser} />}/>
                        <Route path="/login" component={Auth}/>
                    </main>
                </>
            </Switch>
            </div>
        </Router>
    )
}

export default AppRouter;