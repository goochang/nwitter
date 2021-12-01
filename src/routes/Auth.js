import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGoogle, faGithub} from "@fortawesome/free-brands-svg-icons";
import { authService, firebaseDB, firebaseInstance } from "fbase";
import AuthForm from "components/AuthForm";
import { useHistory } from "react-router";
import { useEffect } from "react";

function Auth({userObj}) {
    const history = useHistory();

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
        await authService.signInWithPopup(provider).then(function(result){
            const user = result.user;
            firebaseDB.ref('users')
            .orderByChild('email')
            .startAt(user.email)
            .endAt(user.email+"\uf8ff")
            .once('value', snapshot => {
                if(!snapshot.exists()){
                    console.log("회원가입")
                    firebaseDB.ref('users').push({
                        uid:user.uid,
                        displayName: user.displayName ? user.displayName : user.email,
                        email: user.email ? user.email : "",
                        photoURL: user.photoURL ? user.photoURL : "",
                        coverURL: "",
                        timestamp : user.metadata.creationTime ? user.metadata.creationTime : "",
                    });
                }
            });
        });
        history.push("/");
    }

    return (
        <div className="authContainer">
            <FontAwesomeIcon 
            icon={faTwitter}
            color={"#04AAFF"}
            size="3x"
            style={{marginBottom: 30}} />

            <AuthForm />

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
