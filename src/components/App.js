import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import { dbService } from "../fbase";
import PImg from '../img/default_profile_normal.png';
import { getUser, sendEmail } from "helpers/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  const setUserData = (user, _user, user_id) => {
    setUserObj({
      uid: user.uid,
      userId: user_id,
      name: user.name ? user.name : "",
      displayName: user.displayName ? user.displayName : "",
      email: user.email ? user.email : "",
      introduce: user.introduce ? user.introduce : "",
      photoURL: user.photoURL !== null ? user.photoURL  : PImg,
      coverURL: (user.coverURL !== "" || user.coverURL !== undefined) ? user.coverURL  : "",
      timestamp: user.timestamp,
      followCnt: user.followCnt,
      followingCnt: user.followingCnt,
      updateProfile: (args) => _user.updateProfile(args)
    });
  }
  const refreshUser = () => {
    const user=  authService.currentUser;
    getUser(user, setUserData)
  }
  const logout = () => {
    setUserObj(false);
  }
  useEffect(()=>{
    authService.onAuthStateChanged((user)=>{
      console.log(user)
      if(user){
        // sendEmail();
        getUser(user, setUserData)
      } else{
        setUserObj(false);
      }
      setInit(true);
    })
  },[]);

  return (
    <>
      { init ? 
      <AppRouter 
      isLoggedIn={Boolean(userObj)} 
      userObj={userObj} logout={logout}
      refreshUser={refreshUser} /> 
      : "initializing..." }
    </>
  );
}

export default App; 