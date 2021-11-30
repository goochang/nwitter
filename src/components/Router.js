import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Profile from 'routes/Profile';
import LeftMenu from './LeftMenu';
import Navigation from './Navigation';
import Side from './Side';

const AppRouter = ({userObj, refreshUser, setUserObj}) => {
    return (
        <Router>
            <main>
            <LeftMenu userObj={userObj} />
            <Switch>
                <>
                    <div className="main">
                        <div className="container">
                            <Navigation />
                            <Route exact path="/" 
                            render={()=> <Home userObj={userObj} /> }/>
                            <Route path="/profile" 
                            render={()=> <Profile userObj={userObj} refreshUser={refreshUser} setUserObj={setUserObj} />}/>
                            <Route path="/login" 
                            render={()=> <Auth userObj={userObj} /> } />
                        </div>

                        <Side />
                    </div>
                </>
            </Switch>
            </main>
        </Router>
    )
}

export default AppRouter;