import { authService } from "fbase";
import { useState } from "react";
import { useHistory } from "react-router";

const AuthForm = () => {
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
                data = await authService.createUserWithEmailAndPassword(email, password);

            } else {
                data = await authService.signInWithEmailAndPassword(email, password);
            }
            console.log(data);
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