import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGoogle, faGithub, faGit} from "@fortawesome/free-brands-svg-icons";
import { authService, firebaseInstance } from "fbase";
import AuthForm from "components/AuthForm";
import { useHistory } from "react-router";

function Auth() {
    const history = useHistory();

    const onSocialClick = async (event) => {
        const { target : {name}, } = event;
        let provider;
        if(name==="google"){
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        } else if( name === "github"){
            provider = new firebaseInstance.auth.GithubAuthProvider();
        }
        await authService.signInWithPopup(provider);
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
