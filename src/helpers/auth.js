import { authService, firebaseDB } from "fbase";

export const isEmail = email => {
    const emailRegex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
  
    return emailRegex.test(email);
};

export const sendEmail = () => {
    console.log("send")
    const user = authService.currentUser;
    const url = "http://localhost:3000/nwitter#/verify/" + user.uid;
    const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be in the authorized domains list in the Firebase Console.
        url,
        // This must be true.
        handleCodeInApp: true
      };


    user.sendEmailVerification(actionCodeSettings)
    .then(() => {
        window.localStorage.setItem('emailForSignIn', user.email);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
      });
    
}
export const getUser = async (_user, callback) => {
    firebaseDB.ref('users')
    .orderByChild('email')
    .startAt(_user.email)
    .endAt(_user.email+"\uf8ff")
    .once('value', snapshot => {
        if(snapshot.exists() && snapshot.numChildren() === 1){
            const users = snapshot.val();
            Object.keys(users).forEach((user) => {
                callback(users[user], _user);
              }
            )        
        }
    });
}

export const EmailRegister = async user =>  {
    const data = await authService.createUserWithEmailAndPassword(user.email, user.password)

    if(data.additionalUserInfo.isNewUser){
        const _user = data.user;
        firebaseDB.ref('users')
        .orderByChild('email')
        .startAt(user.email)
        .endAt(user.email+"\uf8ff")
        .once('value', snapshot => {
            if(!snapshot.exists()){
                console.log("회원가입")
                firebaseDB.ref('users').push({
                    uid: _user.uid,
                    timestamp : _user.metadata.creationTime ? _user.metadata.creationTime : "",
                    name: user.name ? user.name : "",
                    nickname: user.nickname ? user.nickname : "",
                    email: user.email ? user.email : "",
                    password: user.password ? user.password : "",
                    introduce: user.introduce ? user.introduce : "",
                    photoURL: user.pImg ? user.pImg : "",
                    coverURL: "",
                }).then(function(){

                });
            }
        });
    }
};