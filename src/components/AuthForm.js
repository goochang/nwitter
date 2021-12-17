import { authService, firebaseDB } from "fbase";
import { useState } from "react";
import { useHistory } from "react-router";

const AuthForm = ({refreshUser}) => {
    const [email, setEmail] = useState("");
    const [password, setPssword] = useState("");
    const [newAccount, setNewAccount] = useState(false);
    const [error, setError] = useState("");

    const history = useHistory();

    const onChange = (event) => {
        const { name, value } = event.target;

        if(name === "email"){
            setEmail(value);
        }
        if(name === "password"){
            setPssword(value);
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            if(newAccount){
                data = await authService.createUserWithEmailAndPassword(email, password)

                if(data.additionalUserInfo.isNewUser){
                    const user = data.user;
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
                                displayName: user.displayName ? user.displayName : user.email,
                                email: user.email ? user.email : "",
                                photoURL: user.photoURL ? user.photoURL : "",
                                coverURL: "",
                                
                            });
                        }
                    });
                }
            } else {
                await authService.signInWithEmailAndPassword(email, password);
            }   
            history.push("/");
        } catch(error){
            setError(error.message);
        }
    }

    const toggleAccount = () => setNewAccount((prev) => !prev);

    return (
        <>
            <form onSubmit={onSubmit} className="container">
                <input name="email" type="email" placeholder="Email" value={email} onChange={onChange} required className="authInput"/>
                <input name="password" type="password" placeholder="Password" value={password} onChange={onChange} required className="authInput"/>
                <input type="submit" className="authSubmit" value={newAccount ? "Create Account" : "Log In"} />
                {error && <span className="authError">{error}</span>}
            </form>
            <span onClick={toggleAccount} className="authSwitch">
                {newAccount ? "Sign In" : "Create Account"}
            </span>
        </>

    )
}

export default AuthForm; 