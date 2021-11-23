import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Profile from 'routes/Profile';
import LeftMenu from './LeftMenu';
import Navigation from './Navigation';

const AppRouter = ({isLoggedIn, userObj, refreshUser}) => {
    return (
        <Router>
            <main>
            <LeftMenu />
            <Switch>
                <>
                    <div className="main">
                        <div className="container">
                            <Navigation />
                            <Route exact path="/" 
                            render={()=> <Home userObj={userObj} /> }/>
                            <Route path="/profile" 
                            render={()=> <Profile userObj={userObj} refreshUser={refreshUser} />}/>
                            <Route path="/login" 
                            render={()=> <Auth userObj={userObj} /> } />
                        </div>
                    </div>
                </>
            </Switch>
            </main>
        </Router>
    )
}

export default AppRouter;