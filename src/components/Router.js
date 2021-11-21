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
            {isLoggedIn && <Navigation userObj={userObj} />}
            <LeftMenu />
            <Switch>
                <>
                    <main 
                    style={{
                        // maxWidth: 890,
                        // width: "100%",
                        // margin: "0 auto",
                        // marginTop: 80,
                        // display: "flex",
                        // justifyContent: "center"
                    }}>
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