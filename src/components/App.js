import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import { dbService } from "../fbase";
import PImg from '../img/default_profile_normal.png';
import { getUser, sendEmail } from "helpers/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  const setUserData = (user, _user) => {
    const email = user.email;
    const userId = email.indexOf("@") !== -1 ? "@" + email.split("@")[0] : "";
    setUserObj({
      uid: user.uid,
      userId: userId,
      name: user.name ? user.name : "",
      nickname: user.nickname ? user.nickname : userId,
      email: user.email ? user.email : "",
      introduce: user.introduce ? user.introduce : "",
      photoURL: user.photoURL !== null ? user.photoURL  : PImg,
      coverURL: user.coverURL !== "" ? user.coverURL  : "",
      timestamp: user.timestamp,
      updateProfile: (args) => _user.updateProfile(args)
    });
  }
  const refreshUser = () => {
    const user=  authService.currentUser;
    setUserData(user)
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