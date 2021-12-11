import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from 'routes/Auth';
import Detail from 'routes/Detail';
import Home from 'routes/Home';
import Profile from 'routes/Profile';
import Search from 'routes/Search';
import Verify from 'routes/Verify';
import LeftMenu from './LeftMenu';
import Navigation from './Navigation';
import Side from './Side';

const AppRouter = ({match, userObj, refreshUser, setUserObj, logout}) => {
    return (
        <Router>
            <main>
            <LeftMenu userObj={userObj} logout={logout} />
            <Switch>
                <>
                    <div className="main">
                        <div className="container">
                            <Navigation />
                            <Route exact path="/" 
                            render={()=> <Home userObj={userObj} /> }/>
                            <Route path="/search/:key1" 
                            render={() => <Search userObj={userObj} />  } />
                            <Route path="/nweet/:key1" 
                            render={() => <Detail userObj={userObj} />  } />
                            <Route path="/profile" 
                            render={()=> <Profile userObj={userObj} refreshUser={refreshUser} setUserObj={setUserObj} />}/>
                            <Route path="/login" 
                            render={()=> <Auth userObj={userObj} refreshUser={refreshUser} /> } />
                            <Route path="/verify/:key1" 
                            component={Verify} />
                            
                        </div>
                        <Side refreshUser={refreshUser} />
                    </div>
                </>
            </Switch>
            </main>
        </Router>
    )
}

export default AppRouter;