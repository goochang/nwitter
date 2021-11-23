import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import { dbService } from "../fbase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  const refreshUser = () => {
    const user=  authService.currentUser;
    
    setUserObj({
      uid: user.uid,
      displayName: user.displayName ? user.displayName : user.email,
      email: user.email ? user.email : "",
      updateProfile: (args) => user.updateProfile(args),
      photoURL: user.photoURL,
      timestamp: user.metadata.creationTime
    });
  }
  
  const addUser = async (user) => {
    await dbService.collection("users").add({
      uid:user.uid,
      displayName: user.providerData[0].displayName ? user.providerData[0].displayName : user.email,
      email: user.email ? user.email : "",
      photoURL: user.photoURL ? user.photoURL : "",
      timestamp : user.metadata.creationTime ? user.metadata.creationTime : "",
    });
  }

  useEffect(()=>{
    const getUser = async (user) => {
      const users = await dbService.collection("users")
      .where("email", "==", user.email)
      .get();
  
      if(users.size === 0){
        addUser(user);
      }
    }

    authService.onAuthStateChanged((user)=>{
      console.log(user)
      if(user){
        setUserObj({
          uid: user.uid,
          displayName: user.displayName ? user.displayName : user.email,
          email: user.email ? user.email : "",
          updateProfile: (args) => user.updateProfile(args),
          photoURL: user.photoURL,
          timestamp: user.metadata.creationTime
        });
        getUser(user);
      } else{
        setUserObj(false);
      }
      setInit(true);
    })
  },[])

  return (
    <>
      { init ? 
      <AppRouter 
      isLoggedIn={Boolean(userObj)} 
      userObj={userObj} 
      refreshUser={refreshUser} /> 
      : "initializing..." }
    </>
  );
}

export default App; 