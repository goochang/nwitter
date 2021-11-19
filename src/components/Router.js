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
                {isLoggedIn ? (
                    <>
                    <div 
                    style={{
                        maxWidth: 890,
                        width: "100%",
                        margin: "0 auto",
                        marginTop: 80,
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <Route exact path="/" 
                        render={()=> <Home userObj={userObj} /> }/>
                        <Route exact path="/profile" 
                        render={()=> <Profile userObj={userObj} refreshUser={refreshUser} />}/>
                    </div>
                    </>
                ) : (
                    <Route exact path="/" component={Auth}/>
                )}
            </Switch>
        </Router>
    )
}

export default AppRouter;