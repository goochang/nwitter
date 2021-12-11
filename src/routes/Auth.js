import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGoogle, faGithub} from "@fortawesome/free-brands-svg-icons";
import { authService, firebaseDB, firebaseInstance } from "fbase";
import AuthForm from "components/AuthForm";
import { useHistory } from "react-router";
import { useEffect, useState } from "react";

function Auth({userObj, refreshUser}) {
    const history = useHistory();
    const [error, setError] = useState("");

    useEffect(()=> {
        if(userObj){
            history.goBack()
        }
    }, );

    const onSocialClick = async (event) => {
        const { target : {name}, } = event;
        let provider;
        if(name==="google"){
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        } else if( name === "github"){
            provider = new firebaseInstance.auth.GithubAuthProvider();
        }
        await authService.signInWithPopup(provider).catch(function(error){
            console.log(error)
            if(error.code === "auth/account-exists-with-different-credential"){
                setError("동일한 이메일의 계정이 있습니다 해당 계정으로 로그인해주세요")
            }
        }).then(function(result){
            console.log(result)
            if(result !== undefined){
                const user = result.user;
                firebaseDB.ref('users')
                .orderByChild('email')
                .startAt(user.email)
                .endAt(user.email+"\uf8ff")
                .once('value', snapshot => {
                    if(!snapshot.exists()){
                        console.log("회원가입")
                        refreshUser();
                        firebaseDB.ref('users').push({
                            uid:user.uid,
                            timestamp : user.metadata.creationTime ? user.metadata.creationTime : "",
                            name: user.displayName ? user.displayName : user.email,
                            displayName: user.displayName ? user.displayName : user.email,
                            email: user.email ? user.email : "",
                            introduce: "",
                            photoURL: user.photoURL ? user.photoURL : "",
                            coverURL: "",
                        });
                    }
                });
                history.push("/");
            }
        });
        
    }

    return (
        <div className="authContainer">
            <FontAwesomeIcon 
            icon={faTwitter}
            color={"#04AAFF"}
            size="3x"
            style={{marginBottom: 30}} />

            <AuthForm refreshUser={refreshUser}/>
            { error && 
                <span>{error}</span>}

            <div className="authBtns">
                <button onClick={onSocialClick} name="google" className="authBtn">
                    Continue with Google <FontAwesomeIcon icon={faGoogle} />
                </button>
                <button onClick={onSocialClick} name="github" className="authBtn">
                    Continue with Github <FontAwesomeIcon icon={faGithub} />
                </button>
                
            </div>
        </div>

    );
}

export default Auth;
